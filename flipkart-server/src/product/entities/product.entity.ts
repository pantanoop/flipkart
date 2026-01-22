import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  productid: number;

  @Column()
  productname: string;

  @Column("float")
  price: number;

  @Column()
  category: string;

  @Column()
  subcategory: string;

  @Column()
  photoUrl: string;

  @Column("varchar", { length: 600 })
  description: string;

  @Column("float")
  rating?: number;

  @Column()
  sellerid: number;
}
