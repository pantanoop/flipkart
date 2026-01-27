/* eslint-disable *//* eslint-disable */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from "./entities/address.entity";
import { CreateAddressDto } from './dto/create-address.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  
  async saveAddress(dto: CreateAddressDto): Promise<Address> {
    let address = await this.addressRepo.findOne({ where: { userid: dto.userid } });

    if (address) {
      
      address.houseNo = dto.houseNo;
      address.area = dto.area;
      address.city = dto.city;
      address.state = dto.state;
      address.pincode = dto.pincode;

      return this.addressRepo.save(address);
    } else {
      
      address = this.addressRepo.create(dto);
      return this.addressRepo.save(address);
    }
  }

  
  async getAddressByUser(userid: number): Promise<Address> {
    const address = await this.addressRepo.findOne({ where: { userid } });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }
}