import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("Coupoun")
export class Coupoun {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  coupoun_name: string;

  @Column()
  discount_offered: string;
}
