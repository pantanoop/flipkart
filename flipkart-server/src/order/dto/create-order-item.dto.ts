/* eslint-disable */
import { IsNumber, IsPositive } from 'class-validator';

export class CreateOrderItemDto {
  @IsNumber()
  productid: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}