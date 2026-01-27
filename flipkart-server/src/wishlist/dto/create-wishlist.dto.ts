import { IsNumber } from "class-validator";

export class CreateWishlistDto {
  @IsNumber()
  productid: number;

  @IsNumber()
  userid: number;
}
