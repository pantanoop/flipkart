import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from "@nestjs/common";
import { CoupounsService } from "./coupouns.service";
import { CreateCoupounDto } from "./dto/create-coupoun.dto";
import { UpdateCoupounDto } from "./dto/update-coupoun.dto";

@Controller("coupouns")
export class CoupounsController {
  constructor(private readonly coupounsService: CoupounsService) {}

  // @Post()
  // create(@Body() createCoupounDto: CreateCoupounDto) {
  //   return this.coupounsService.create(createCoupounDto);
  // }

  @Get()
  findCoupoun(@Query() data: any) {
    console.log();
    return this.coupounsService.findCoupoun(data);
  }

  // @Get(":id")
  // findOne(@Param("id") id: string) {
  //   return this.coupounsService.findOne(+id);
  // }

  // @Patch(":id")
  // update(@Param("id") id: string, @Body() updateCoupounDto: UpdateCoupounDto) {
  //   return this.coupounsService.update(+id, updateCoupounDto);
  // }

  // @Delete(":id")
  // remove(@Param("id") id: string) {
  //   return this.coupounsService.remove(+id);
  // }
}
