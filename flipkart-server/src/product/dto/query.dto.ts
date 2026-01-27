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
  page: number;

  @IsOptional()
  @IsString()
  subcategory: string;

  @IsOptional()
  @IsString()
  searchTerm: string;

  @IsOptional()
  @IsString()
  userid: number;
}
