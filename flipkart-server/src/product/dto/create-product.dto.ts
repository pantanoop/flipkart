/* eslint-disable */
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateProductDto {
  @IsOptional()
  @IsNumber({}, { message: "id must be a number" })
  productid?: number;

  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title cannot be empty" })
  productname: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be a number" })
  @IsNotEmpty({ message: "Price cannot be empty" })
  price: number;

  @IsString({ message: "Category must be a string" })
  @IsNotEmpty({ message: "Category cannot be empty" })
  category: string;

  @IsString({ message: "Subcategory must be a string" })
  @IsNotEmpty({ message: "Subcategory cannot be empty" })
  subcategory: string;

  @IsOptional()
  imageUrls?: string[];

  @IsString({ message: "Description must be a string" })
  @Length(3, 600, {
    message: "Description must be between 3 and 600 characters",
  })
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 1 }, { message: "Rating must be a number" })
  rating?: number;

  @IsNumber({}, { message: "seller id should be a number" })
  @IsNotEmpty({ message: "seller id cant be empty" })
  sellerid: number;

  @IsBoolean()
  @IsOptional()
  isBanned: boolean;

  @IsNumber()
  @IsOptional()
  quantity: number;
}
