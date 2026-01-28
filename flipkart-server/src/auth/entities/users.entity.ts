import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userid: number;

  @Column({ unique: true })
  useremail: string;

  @Column()
  userpassword: string;

  @Column({ unique: true })
  username: string;

  @Column()
  role: string;

  @Column()
  isBanned: boolean;
}
