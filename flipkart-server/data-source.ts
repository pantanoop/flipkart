import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./src/auth/entities/users.entity";
import { Product } from "./src/product/entities/product.entity";
import * as dotenv from "dotenv";
import { SeederOptions } from "typeorm-extension";
import UserFactory from "./src/databases/factories/user.factory";
import UserSeeder from "./src/databases/seeds/user.seeder";
import { Address } from "src/address/entities/address.entity";
import { Order } from "src/order/entities/order.entity";
import { OrderItem } from "src/order/entities/order-item.entity";
import { Wishlist } from "src/wishlist/entities/wishlist.entity";
import { Coupoun } from "src/coupouns/entities/coupoun.entity";
import CoupounSeeder from "src/databases/seeds/coupouns.seeder";
dotenv.config();

const datasource: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Product, Address, Order, OrderItem, Wishlist, Coupoun],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  factories: [UserFactory],
  seeds: [UserSeeder, CoupounSeeder],
};

export const AppDataSource = new DataSource(datasource);
