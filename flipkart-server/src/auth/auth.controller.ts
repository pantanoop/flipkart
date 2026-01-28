/* eslint-disable */
import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Param,
  Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";

import { LoginAuthDto } from "./dto/login-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get("users")
  getUsers(@Query("page") page = 1, @Query("limit") limit = 5) {
    return this.authService.getAllNonAdminUsers(Number(page), Number(limit));
  }

  @Patch("ban/:userid")
  toggleBanUser(@Param("userid") userid: number) {
    console.log(userid, "hitted controler");
    return this.authService.toggleBanUser(userid);
  }

  @Post("/register")
  registerUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Post("/login")
  loginUser(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.loginUser(loginAuthDto);
  }
  @Post("/login/google")
  signInWithGoogle(@Body() userGoogleDto: CreateAuthDto) {
    return this.authService.signInWithGoogle(userGoogleDto);
  }
}
