import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateProductDto {
  @IsNumber({}, { message: "id must be a number" })
  @IsOptional()
  productid: number;

  @IsString({ message: "Title must be a string" })
  @IsNotEmpty({ message: "Title cannot be empty" })
  productname: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: "Price must be a number" })
  @IsNotEmpty({ message: "Price cannot be empty" })
  price: number;

  @IsString({ message: "Category must be a string" })
  @IsNotEmpty({ message: "Category cannot be empty" })
  category: string;

  @IsString({ message: "Category must be a string" })
  @IsNotEmpty({ message: "Category cannot be empty" })
  subcategory: string;

  @IsString({ message: "Thumbnail must be a string" })
  @IsOptional()
  photoUrl?: string;

  @IsString({ message: "Description must be a string" })
  @Length(3, 600, { message: "Name must be between 1 and 600 characters" })
  description?: string;

  @IsNumber({ maxDecimalPlaces: 1 }, { message: "Rating must be a number" })
  @IsOptional()
  rating?: number;

  @IsNumber({}, { message: "seller id should be a number" })
  @IsNotEmpty({ message: "seller id cant be empty" })
  sellerid: number;
}
