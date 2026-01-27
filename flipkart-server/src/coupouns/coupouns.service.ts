import { Injectable } from "@nestjs/common";
import { CreateCoupounDto } from "./dto/create-coupoun.dto";
import { UpdateCoupounDto } from "./dto/update-coupoun.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Coupoun } from "./entities/coupoun.entity";

@Injectable()
export class CoupounsService {
  constructor(
    @InjectRepository(Coupoun)
    private readonly coupounRepo: Repository<Coupoun>,
  ) {}
  // create(createCoupounDto: CreateCoupounDto) {
  //   return "This action adds a new coupoun";
  // }

  async findCoupoun(data: any) {
    console.log(data, "service");
    // const cn = "anoop10";
    // console.log(cn, "custom");
    // console.log(coupoun_name, "body");

    const res = await this.coupounRepo.findOne({
      where: { coupoun_name: data?.coupoun_name },
    });
    console.log(res?.discount_offered);
    return res?.discount_offered;
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} coupoun`;
  // }

  // update(id: number, updateCoupounDto: UpdateCoupounDto) {
  //   return `This action updates a #${id} coupoun`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} coupoun`;
  // }
}
