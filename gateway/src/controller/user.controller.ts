import { Controller, Get, Query } from "@nestjs/common";
import { AuthService } from "src/services";

@Controller("users")
export class UserController {
  constructor(private readonly userService: AuthService) {}

  @Get()
  async getUsers(@Query() filter) {
    return await this.userService.users(filter);
  }

  @Get("/me")
  async getMe(@Query() filter) {
    return await this.userService.getMe(filter);
  }
}
