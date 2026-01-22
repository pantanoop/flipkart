import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductQueryDto } from "./dto/query.dto";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post("/product/addproduct")
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll(@Query() queryDto: ProductQueryDto) {
    console.log("con", queryDto);
    return this.productService.findAll(queryDto);
  }

  @Get("product/:id")
  findOne(@Param("id") id: string) {
    return this.productService.findOne(+id);
  }

  @Patch("update/product/:id")
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete("delete/product/:id")
  remove(@Param("id") id: string) {
    return this.productService.remove(+id);
  }
}
