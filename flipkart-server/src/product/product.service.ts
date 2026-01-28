/* eslint-disable */
import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, ILike } from "typeorm";

import { Product } from "./entities/product.entity";
import { User } from "../auth/entities/users.entity";

import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { ProductQueryDto } from "./dto/query.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const {
      productname,
      category,
      subcategory,
      price,
      description,
      sellerid,
      quantity,
    } = createProductDto;

    const imageUrls =
      files?.map((file) => `http://localhost:5000/uploads/${file.filename}`) ||
      [];

    const newProduct = this.productRepository.create({
      productid: Date.now(),
      productname,
      category,
      subcategory,
      price,
      description,
      imageUrls,
      rating: 0,
      sellerid,
      isBanned: false,
      quantity: quantity ?? 10,
    });

    await this.productRepository.save(newProduct);
    return newProduct;
  }

  // async findAll(queryDto: ProductQueryDto) {
  //   const {
  //     page = 1,
  //     limit = 10,
  //     category,
  //     subcategory,
  //     searchTerm,
  //     userid,
  //   } = queryDto;

  //   const whereObj: any = {};

  //   if (category) whereObj.category = category;
  //   if (subcategory) whereObj.subcategory = subcategory;

  //   if (searchTerm?.trim()) {
  //     whereObj.productname = ILike(`%${searchTerm.trim()}%`);
  //   }

  //   if (userid) {
  //     const user = await this.userRepository.findOne({
  //       where: { userid: Number(userid) },
  //     });

  //     if (!user) {
  //       throw new HttpException("User not found", 404);
  //     }

  //     if (user.role === "seller") {
  //       whereObj.sellerid = user.userid;
  //     }

  //     if (user.role === "customer") {
  //       whereObj.isBanned = false;
  //     }
  //   }

  //   const skip = (page - 1) * limit;

  //   const [products, total] = await this.productRepository.findAndCount({
  //     where: whereObj,
  //     skip,
  //     take: limit,
  //   });

  //   return {
  //     data: products,
  //     meta: {
  //       total,
  //       page,
  //       limit,
  //       skip,
  //       totalPages: Math.ceil(total / limit),
  //       hasNextPage: skip + products.length < total,
  //     },
  //   };
  // }

  async findAll(queryDto: ProductQueryDto) {
    const {
      page = 1,
      limit = 10,
      category,
      subcategory,
      searchTerm,
      userid,
    } = queryDto;

    const whereObj: any = {};
    console.log(userid);

    if (category) whereObj.category = category;
    if (subcategory) whereObj.subcategory = subcategory;

    if (searchTerm?.trim()) {
      whereObj.productname = ILike(`%${searchTerm.trim()}%`);
    }

    if (userid) {
      const user = await this.userRepository.findOne({
        where: { userid: Number(userid) },
      });

      if (!user) {
        throw new HttpException("User not found", 404);
      }

      if (user.role === "seller") {
        whereObj.sellerid = Number(user.userid);
      } else if (user.role === "customer") {
        whereObj.isBanned = false;
      }
    } else {
      whereObj.isBanned = false;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await this.productRepository.findAndCount({
      where: whereObj,
      skip,
      take: limit,
    });
    // console.log(products);
    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        skip,
        totalPages: Math.ceil(total / limit),
        hasNextPage: skip + products.length < total,
      },
    };
  }

  async findOne(productid: number) {
    const product = await this.productRepository.findOne({
      where: { productid },
    });

    if (!product) {
      throw new HttpException("Product not found", 404);
    }

    return product;
  }

  async update(
    productid: number,
    updateProductDto: UpdateProductDto,
    files?: Express.Multer.File[],
  ) {
    const product = await this.productRepository.findOne({
      where: { productid },
    });

    if (!product) {
      throw new HttpException("Product not found", 404);
    }

    let imageUrls = product.imageUrls;

    if (files?.length) {
      imageUrls = files.map(
        (file) => `http://localhost:5000/uploads/${file.filename}`,
      );
    }

    const updatedProduct = {
      ...product,
      ...updateProductDto,
      imageUrls,
    };

    await this.productRepository.save(updatedProduct);
    return updatedProduct;
  }

  async remove(productid: number) {
    const product = await this.productRepository.findOne({
      where: { productid },
    });

    if (!product) {
      throw new HttpException("Product not found", 404);
    }

    await this.productRepository.delete({ productid });
    return product;
  }
  async banProduct(id: number) {
    const product = await this.productRepository.findOne({
      where: { productid: id },
    });
    if (!product) {
      throw new HttpException("Product not found", 404);
    }
    const updatedProduct = {
      ...product,
      isBanned: !product.isBanned,
    };
    // console.log(updatedProduct);
    await this.productRepository.save(updatedProduct);
    return updatedProduct;
  }
}
