/* eslint-disable */
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderid: number;

  @ManyToOne(() => Order, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orderid' })
  order: Order;

  @Column({type: "bigint"})
  productid: number;

  @Column({type: "bigint"})
  sellerid: number;

  @Column()
  quantity: number;

  @Column({ type: 'float' })
  priceAtPurchase: number;
}