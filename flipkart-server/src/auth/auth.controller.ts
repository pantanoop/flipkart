import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateAuthDto } from "./dto/create-auth.dto";

import { LoginAuthDto } from "./dto/login-auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/register")
  registerUser(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.createUser(createAuthDto);
  }

  @Post("/login")
  loginUser(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.findUser(loginAuthDto);
  }
  @Post("/login/google")
  googleLogin(@Body() userGoogleDto: CreateAuthDto) {
    return this.authService.singInWithGoogle(userGoogleDto);
  }
}
