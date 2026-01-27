import { Module } from "@nestjs/common";
import { CoupounsService } from "./coupouns.service";
import { CoupounsController } from "./coupouns.controller";
import { Coupoun } from "./entities/coupoun.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([Coupoun])],
  controllers: [CoupounsController],
  providers: [CoupounsService],
})
export class CoupounsModule {}
