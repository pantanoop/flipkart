/* eslint-disable */
import { Body, Controller, Param, Patch, Post, Get } from "@nestjs/common";
import { OrderService } from "./order.service";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderStatus } from "./enums/order-status.enum";

@Controller("orders")
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async createOrder(
    @Body("userid") userid: number,
    @Body("discountApplied") discountApplied: string,
    @Body() dto: CreateOrderDto,
  ) {
    console.log("dto of order", discountApplied);
    return this.orderService.createOrder(userid, discountApplied, dto);
  }

  @Patch(":orderid/cancel")
  async cancelOrder(
    @Param("orderid") orderid: string,
    @Body("userid") userid: number,
  ) {
    return this.orderService.cancelOrder(orderid, userid);
  }

  @Get("user/:userid")
  async getUserOrders(@Param("userid") userid: number) {
    console.log("hitted dto order fetch ", userid);
    return this.orderService.getOrdersByUser(userid);
  }

  @Get("seller/:sellerid")
  getSellerOrders(@Param("sellerid") sellerid: number) {
    return this.orderService.getOrdersBySellerId(+sellerid);
  }

  @Get("admin/all")
  getAllOrdersForAdmin() {
    return this.orderService.getAllOrdersForAdmin();
  }

  @Patch(":orderid/status")
  async updateOrderStatus(
    @Param("orderid") orderId: string,
    @Body("status") status: OrderStatus,
  ) {
    return this.orderService.updateOrderStatus(orderId, status);
  }
}
