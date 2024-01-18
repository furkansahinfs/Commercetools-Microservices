import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { GetUsersFilterDTO } from "src/dto";
import { UserService } from "src/services";
import { RolesGuard } from "src/middleware";
import { Roles } from "src/util";
import { ROLES } from "src/enums";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  async getUsers(@Query() filter: GetUsersFilterDTO) {
    return await this.userService.getUsers(filter);
  }

  @Get("/me")
  async getMe() {
    return await this.userService.getMe();
  }
}
