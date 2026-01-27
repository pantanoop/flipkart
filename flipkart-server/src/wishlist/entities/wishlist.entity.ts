import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("wishlist")
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "bigint" })
  productid: number;

  @Column({ type: "bigint" })
  userid: number;
}
