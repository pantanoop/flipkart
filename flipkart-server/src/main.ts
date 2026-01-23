import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: "*" });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();

//npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run -d ./data-source.ts
// npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:revert -d ./data-source.ts
