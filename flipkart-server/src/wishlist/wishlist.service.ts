import { Injectable } from "@nestjs/common";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Product } from "src/product/entities/product.entity";
import { Repository } from "typeorm";
import { Wishlist } from "./entities/wishlist.entity";

@Injectable()
export class WishlistService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Wishlist)
    private readonly wishlistRepo: Repository<Wishlist>,
  ) {}

  async create(createWishlistDto: CreateWishlistDto) {
    const existing = await this.wishlistRepo.find({
      where: {
        userid: createWishlistDto.userid,
        productid: createWishlistDto.productid,
      },
    });
    console.log(existing.length, "eygeg");
    if (!existing.length) {
      const newItemInWishlist = this.wishlistRepo.create({
        productid: createWishlistDto.productid,
        userid: createWishlistDto.userid,
      });
      await this.wishlistRepo.save(newItemInWishlist);
      return newItemInWishlist;
    }
    return `already in wishlist`;
  }

  async findAll(id: number) {
    const items = await this.wishlistRepo.find({
      select: {
        productid: true,
      },
      where: {
        userid: Number(id),
      },
    });
    const products: any = [];
    for (const item of items) {
      const product = await this.productRepo.findOne({
        where: { productid: item.productid },
      });
      if (!product) continue;
      products.push(product);
    }
    // console.log(products);
    // items.map((item) => console.log(item.productid));
    return products;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} wishlist`;
  // }

  update(id: number, updateWishlistDto: UpdateWishlistDto) {
    return `This action updates a #${id} wishlist`;
  }

  // remove(id: number) {
  //   return `This action removes a #${id} wishlist`;
  // }

  // async remove(productid: number,userid:number) {
  //     const item = await this.wishlistRepo.findOne({
  //       where: { userid:userid && productid:productid},
  //     });

  //     if (!item) {
  //       throw new HttpException("Product not found", 404);
  //     }

  //     await this.wishlistRepo.delete({ productid });
  //     return ;
  //   }
}
