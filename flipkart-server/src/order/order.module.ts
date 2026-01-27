/* eslint-disable */

import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderService } from "./order.service";
import { OrderController } from "./order.controller";
import { Order } from "./entities/order.entity";
import { OrderItem } from "./entities/order-item.entity";
import { Product } from "../product/entities/product.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      OrderItem,
      Product, 
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}