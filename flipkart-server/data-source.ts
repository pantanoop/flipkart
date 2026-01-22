import "reflect-metadata";
import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "./src/auth/entities/users.entity";
import { Product } from "./src/product/entities/product.entity";
import * as dotenv from "dotenv";
import { SeederOptions } from "typeorm-extension";
import UserFactory from "./src/databases/factories/user.factory";
import UserSeeder from "./src/databases/seeds/user.seeder";
dotenv.config();

const datasource: DataSourceOptions & SeederOptions = {
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User, Product],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
  factories: [UserFactory],
  seeds: [UserSeeder],
};

export const AppDataSource = new DataSource(datasource);
