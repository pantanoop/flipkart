import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateAuthDto {
  @IsNumber({}, { message: "id must be a number" })
  @IsOptional()
  userid: number;

  @IsString({ message: "Email must be a string" })
  @IsNotEmpty({ message: "Email cannot be empty" })
  useremail: string;

  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password cannot be empty" })
  userpassword: string;

  @IsString({ message: "username must be a string" })
  @IsNotEmpty({ message: "username cannot be empty" })
  username: string;

  @IsString({ message: "role must be a string" })
  @IsOptional()
  role: string;
}
