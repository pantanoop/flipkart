import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as express from "express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use("/uploads", express.static("uploads"));
  app.enableCors({ origin: "*" });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

//npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./data-source.ts
// npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ./data-source.ts
