import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./src/auth/entities/users.entity";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [User],
  migrations: ["src/migrations/*.ts"],
  synchronize: false,
});
