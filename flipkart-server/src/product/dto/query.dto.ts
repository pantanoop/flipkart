import { IsOptional, IsString, IsNumber } from "class-validator";

export class ProductQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  limit: number;

  @IsNumber()
  @IsOptional()
  page: number = 1;

  @IsOptional()
  @IsString()
  subcategory: string;
}
