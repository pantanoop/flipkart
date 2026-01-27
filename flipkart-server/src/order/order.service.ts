/* eslint-disable */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from './enums/order-status.enum';
import { Product } from '../product/entities/product.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepo: Repository<OrderItem>,

    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    private readonly dataSource: DataSource,
  ) {}

  async createOrder(userid: number, dto: CreateOrderDto) {
    if (!dto.items.length) {
      throw new BadRequestException('Order must contain at least one item');
    }

    return this.dataSource.transaction(async (manager) => {
      let totalAmount = 0;
      const orderItems: OrderItem[] = [];

      for (const item of dto.items) {
        const product = await manager.findOne(Product, {
          where: { productid: item.productid, isBanned: false },
          lock: { mode: 'pessimistic_write' },
        });

        if (!product) {
          throw new NotFoundException(
            `Product ${item.productid} not found or banned`,
          );
        }

         if (product.quantity < item.quantity) {
        throw new BadRequestException(
          `Product ${product.productid} only has ${product.quantity} left`,
        );
      }

       product.quantity -= item.quantity;
      await manager.save(product); 

        totalAmount += product.price * item.quantity;

        const orderItem = manager.create(OrderItem, {
          productid: product.productid,
          sellerid: product.sellerid,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        });

        orderItems.push(orderItem);
      }

      const order = manager.create(Order, {
        orderid: `ORD-${Date.now()}`, 
        userid: userid,              
        totalAmount,
        status: OrderStatus.ORDERED,
        items: orderItems,
      });

      return manager.save(order);
    });
  }

  
async cancelOrder(orderid: string, userid: number) {
  
  const order = await this.orderRepo.findOne({
    where: { orderid },
    relations: ['items'], 
  });

  if (!order) {
    throw new NotFoundException('Order not found');
  }

  if (order.userid !== userid) {
    throw new ForbiddenException('Not allowed to cancel this order');
  }

  if (order.status !== OrderStatus.ORDERED) {
    throw new BadRequestException('Only ORDERED orders can be cancelled');
  }

  
  return this.dataSource.transaction(async (manager) => {
    
    order.status = OrderStatus.CANCELLED;
    await manager.save(order);

    
    for (const item of order.items) {
      const product = await manager.findOne(Product, {
        where: { productid: item.productid },
        lock: { mode: 'pessimistic_write' }, 
      });

      if (!product) continue; 

      product.quantity += item.quantity; 
      await manager.save(product);
    }

    return order; 
  });
}


  async getOrdersByUser(userid: number) {
  return this.orderRepo.find({
    where: { userid },
    relations: ['items'],
    order: { createdAt: 'DESC' },
  });
}
async getOrdersBySellerId(sellerid: number) {
  return this.orderItemRepo.find({
    where: { sellerid },
    relations: {
      order: true,     
    },
    order: {
      id: 'DESC',
    },
  });
}

async getAllOrdersForAdmin() {
  return this.orderRepo.find({
    relations: ['items'],
    order: {
      createdAt: 'DESC',
    },
  });
}

  async updateOrderStatus(orderid: string, status: OrderStatus) {
    const order = await this.orderRepo.findOne({
      where: { orderid },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.ORDERED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
      [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
      [OrderStatus.DELIVERED]: [],
      [OrderStatus.CANCELLED]: [],
    };

    if (!validTransitions[order.status].includes(status)) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${status}`,
      );
    }

    order.status = status;
    return this.orderRepo.save(order);
  }
}