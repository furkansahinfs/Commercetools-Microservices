import { Controller, Get, Query } from "@nestjs/common";
import { AuthService } from "src/services";

/** DTO validated in services */

@Controller("users")
export class UserController {
  constructor(private readonly userService: AuthService) {}

  @Get()
  async getUsers(@Query() filter) {
    return this.userService.users(filter);
  }

  @Get("/me")
  async getMe() {
    return this.userService.getMe();
  }
}
