import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Not } from "typeorm";
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
      isBanned: false,
    });

    await this.userRepository.save(newUser);

    return newUser;
  }

  async loginUser(loginAuthDto: LoginAuthDto) {
    const { useremail, userpassword } = loginAuthDto;

    const existingUser = await this.userRepository.findOne({
      where: { useremail },
    });

    if (!existingUser) {
      throw new HttpException("Email not found", 404);
    }

    if (existingUser.isBanned) {
      throw new HttpException("User is banned. Contact admin.", 403);
    }

    if (existingUser.userpassword !== userpassword) {
      throw new HttpException("Password not found", 404);
    }

    return existingUser;
  }

  async signInWithGoogle(userGoogleDto: CreateAuthDto) {
    const { useremail } = userGoogleDto;

    let user = await this.userRepository.findOne({
      where: { useremail },
    });

    if (!user) {
      user = this.userRepository.create({ ...userGoogleDto });
      await this.userRepository.save(user);
    }

    if (user.isBanned) {
      throw new HttpException("User is banned. Contact admin.", 403);
    }

    return user;
  }

  async getAllNonAdminUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [users, total] = await this.userRepository.findAndCount({
      where: {
        role: Not("admin"),
      },
      skip,
      take: limit,
      order: {
        userid: "DESC",
      },
    });

    return {
      data: users,
      total,
    };
  }

  async toggleBanUser(userId: number) {
    console.log("hitted service", userId);
    const user = await this.userRepository.findOne({
      where: { userid: userId },
    });

    if (!user) {
      throw new HttpException({ message: "User not found" }, 404);
    }

    if (user.role === "admin") {
      throw new HttpException(
        { message: "Admin users cannot be banned or unbanned" },
        403,
      );
    }

    user.isBanned = !user.isBanned;
    // await this.userRepository.save(user);

    return await this.userRepository.save(user);
  }
}
