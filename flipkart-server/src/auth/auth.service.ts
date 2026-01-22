import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { User } from "./entities/users.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createAuthDto: CreateAuthDto) {
    const { userid, username, useremail, userpassword, role } = createAuthDto;

    const existingEmail = await this.userRepository.findOne({
      where: { useremail },
    });

    const existingUsername = await this.userRepository.findOne({
      where: { username },
    });

    const uid = userid ? userid : Date.now();
    const userRole = role ? role : "customer";

    if (existingEmail) {
      throw new HttpException({ message: "Email already in use" }, 400);
    }

    if (existingUsername) {
      throw new HttpException({ message: "Username already in use" }, 400);
    }

    const newUser = this.userRepository.create({
      userid: uid,
      username,
      useremail,
      userpassword,
      role: userRole,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async findUser(loginAuthDto: LoginAuthDto) {
    const { useremail, userpassword } = loginAuthDto;

    const existingUser = await this.userRepository.findOne({
      where: { useremail, userpassword },
    });

    if (!existingUser) {
      throw new HttpException({ message: "Invalid credentials" }, 404);
    }

    return existingUser;
  }

  async singInWithGoogle(userGoogleDto: CreateAuthDto) {
    const { useremail } = userGoogleDto;

    const existing = await this.userRepository.findOne({
      where: { useremail },
    });

    if (!existing) {
      const newUser = this.userRepository.create({
        ...userGoogleDto,
      });

      await this.userRepository.save(newUser);
    }

    return userGoogleDto;
  }
}
