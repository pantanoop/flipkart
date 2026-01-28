/* eslint-disable */
import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { FilesInterceptor } from "@nestjs/platform-express";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductQueryDto } from "./dto/query.dto";
import { productImageStorage } from "../config/multer.config";
import { Express } from "express";

@Controller("products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // @Post("")
  // @UseInterceptors(
  //   FilesInterceptor("images", 5, {
  //     storage: productImageStorage,
  //   }),
  // )
  // create(
  //   @UploadedFiles() files: Express.Multer.File[],
  //   @Body() createProductDto: CreateProductDto,
  // ) {
  //   return this.productService.create(createProductDto, files);
  // }
  // @Post("")
  // @UseInterceptors(FileInterceptor("file"))
  // async create(@Body() body: CreateProductDto) {
  //   if (File) {
  //     body.imageUrls = `/uploads/${File.name}`;
  //   }
  //   return this.productService.create(body);
  // }

  @Post("")
  @UseInterceptors(
    FilesInterceptor("images", 5, {
      storage: productImageStorage,
    }),
  )
  create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createProductDto: CreateProductDto,
  ) {
    if (createProductDto.quantity !== undefined) {
      createProductDto.quantity = Number(createProductDto.quantity);
    }

    return this.productService.create(createProductDto, files);
  }

  @Get()
  findAll(@Query() queryDto: ProductQueryDto) {
    // console.log("controller",queryDto)
    return this.productService.findAll(queryDto);
  }

  @Get(":id")
  findOne(@Param("id") id: number) {
    // console.log("hitted",id)
    return this.productService.findOne(+id);
  }

  @Put(":id")
  @UseInterceptors(
    FilesInterceptor("images", 5, {
      storage: productImageStorage,
    }),
  )
  update(
    @Param("id") id: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() updateProductDto: UpdateProductDto,
  ) {
    // console.log("hitted update",id,updateProductDto)
    return this.productService.update(+id, updateProductDto, files);
  }
  @Put(":id/ban")
  banProduct(@Param("id") id: number) {
    return this.productService.banProduct(id);
  }

  @Delete(":id")
  remove(@Param("id") id: number) {
    // console.log("controllr",id)
    return this.productService.remove(+id);
  }
}
