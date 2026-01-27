import { IsString } from "class-validator";

export class CreateCoupounDto {
  @IsString()
  coupoun_name: number;

  @IsString()
  discount_offered: number;
}
