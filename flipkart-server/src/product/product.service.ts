import { HttpException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductQueryDto } from "./dto/query.dto";
import { randomInt } from "crypto";
import { time } from "console";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const {
      productname,
      category,
      subcategory,
      price,
      description,
      photoUrl,
      sellerid,
    } = createProductDto;

    const newProduct = this.productRepository.create({
      productid: Date.now(),
      productname,
      price,
      category,
      subcategory,
      description,
      photoUrl,
      rating: 0,
      sellerid,
    });

    await this.productRepository.save(newProduct);

    return newProduct;
  }

  async findAll(queryDto: ProductQueryDto) {
    const { page, limit, category, subcategory } = queryDto;
    console.log("servicedto", queryDto);
    let whereObj:any={};
    if(category){
      whereObj.category=category;
    }
  
const offset = page - 1 * limit;

    let products = await this.productRepository.find({
      where:whereObj,
      skip:offset,
      take:limit
    });
    console.log("all products", products);
    if (category) {
      products = products.filter(
        (p) => p.category === category,
        // console.log("each product category", p.category);
      );
      console.log("category", products);
    }
    if (subcategory) {
      products = products.filter((p) => p.subcategory === subcategory);
    }

    const total = products.length;

    // if (limit !== undefined && page !== undefined) {
    //   const offset = page - 1 * limit;
    //   const paginatedproducts = await this.productRepository.find({
    //     skip: offset,
    //     take: limit,
    //   });

    if (limit !== undefined && page !== undefined) {
      const offset = page - 1 * limit;
      const paginatedproducts = products.slice(offset, offset + limit);
      return {
        paginatedproducts,
        total,
      };
    }
    return {
      products,
      total,
    };
  }

  async findOne(productid: number) {
    const product = await this.productRepository.findOne({
      where: { productid },
    });
    if (!product) {
      throw new HttpException({ message: "product not found" }, 404);
    }
    return product;
  }

  async update(productid: number, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { productid },
    });
    if (!product) {
      throw new HttpException({ message: "product not found" }, 404);
    }
    await this.productRepository.update({ productid }, updateProductDto);
    return product;
  }

  async remove(productid: number) {
    const deletedproduct = await this.productRepository.findOne({
      where: { productid },
    });
    if (!deletedproduct) {
      throw new HttpException({ message: "product not found" }, 404);
    }
    const res = await this.productRepository.delete({ productid });
    console.log(res.affected);
    return deletedproduct;
  }
}
