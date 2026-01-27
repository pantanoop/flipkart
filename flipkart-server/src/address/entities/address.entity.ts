/* eslint-disable */

import { Entity, Column, PrimaryGeneratedColumn,  } from 'typeorm';

@Entity('addresses')
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  houseNo: string;

  @Column()
  area: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: string;

  @Column({type:"bigint"})
  userid: number; 
}