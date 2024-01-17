import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "src/services";

/** DTO validated in services */

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  async login(@Body() dto) {
    return await this.authService.login(dto);
  }
  @Post("/register")
  async register(@Body() dto) {
    return await this.authService.register(dto);
  }
}
