import { HttpException, Injectable } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductQueryDto } from "./dto/query.dto";

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    const { productname, category, subcategory, price, description, sellerid } =
      createProductDto;

    const imageUrls =
      files?.map((file) => `/uploads/products/${file.filename}`) || [];

    const newProduct = this.productRepository.create({
      productid: Date.now(),
      productname,
      price,
      category,
      subcategory,
      description,
      imageUrls,
      rating: 0,
      sellerid,
    });

    await this.productRepository.save(newProduct);
    return newProduct;
  }

  async findAll(queryDto: ProductQueryDto) {
    const { page, limit, category, subcategory } = queryDto;

    const whereObj: any = {};

    if (category) whereObj.category = category;
    if (subcategory) whereObj.subcategory = subcategory;

    const offset =
      page !== undefined && limit !== undefined
        ? (page - 1) * limit
        : undefined;

    const [products, total] = await this.productRepository.findAndCount({
      where: whereObj,
      skip: offset,
      take: limit,
    });

    if (limit !== undefined && page !== undefined) {
      return {
        paginatedproducts: products,
        total,
      };
    }

    return {
      products,
      total,
      skip: offset ?? 0,
      limit: limit ?? total,
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

    await this.productRepository.delete({ productid });
    return deletedproduct;
  }
}
