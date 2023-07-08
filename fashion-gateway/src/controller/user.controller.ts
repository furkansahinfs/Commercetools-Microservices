import { Controller, Get, Query, Res, UseGuards } from "@nestjs/common";
import { GetUsersFilterDTO } from "src/dto";
import { Response } from "express";
import { UserService } from "src/services";
import { RolesGuard } from "src/middleware";
import { Roles } from "src/util";
import { ROLES } from "src/enums";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("/users")
  @Roles(ROLES.ADMIN)
  @UseGuards(RolesGuard)
  async getUsers(
    @Query() filter: GetUsersFilterDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    res["promise"](await this.userService.getUsers(filter));
  }
}
