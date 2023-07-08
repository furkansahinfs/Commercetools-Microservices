import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { I18nService } from "nestjs-i18n";
import { GetUsersFilterDTO } from "src/dto";
import { ResponseBody, getJWTUserId } from "src/util";
import { User } from "src/dto/user.dto";

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private readonly i18n: I18nService,
  ) {}

  async getUsers(dto: GetUsersFilterDTO) {
    if (dto?.userId || dto?.username) {
      return await this.getUserWithFilter(dto);
    }
    const users: {
      email: string;
      id: string;
      last_logged_in: Date;
    }[] = await this.prisma.user.findMany({
      select: {
        email: true,
        id: true,
        last_logged_in: true,
      },
      orderBy: {
        id: "desc",
      },
      take: dto?.limit ? parseInt(dto.limit) : undefined,
      skip: dto?.offset ? parseInt(dto.offset) : undefined,
    });

    return ResponseBody().status(HttpStatus.OK).data(users).build();
  }

  private async getUserWithFilter(dto: GetUsersFilterDTO) {
    const user = dto?.userId
      ? await this.findByUserId(dto.userId)
      : dto?.username
      ? await this.findByUsername(dto.username)
      : null;
    if (user) {
      return ResponseBody().status(HttpStatus.OK).data(user).build();
    }

    return ResponseBody()
      .status(HttpStatus.NOT_FOUND)
      .message({ error: this.i18n.translate("user.user_not_found") })
      .build();
  }

  async getAuthenticatedUser(headerAuthorization: string): Promise<User> {
    const accessTokenStr = headerAuthorization;
    const accessToken = accessTokenStr?.replace("Bearer ", "");
    const userId: string = getJWTUserId(accessToken, "ACCESS_TOKEN_PUBLIC_KEY");
    return await this.findByUserId(userId, { password: true });
  }

  async findByUsername(
    username: string,
    exclude?: { password: true },
  ): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: username,
      },
      select: {
        email: true,
        password: exclude?.password ? true : false,
        id: true,
        last_logged_in: true,
        role: true,
      },
    });
    if (user?.role) {
      user.role = user.role.replace(process.env.ROLE_KEY, "");
    }
    return user;
  }

  async findByUserId(
    userId: string,
    exclude?: { password: true },
  ): Promise<User> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        email: true,
        password: exclude?.password ? true : false,
        id: true,
        last_logged_in: true,
        role: true,
      },
    });

    user.role = user.role.replace(process.env.ROLE_KEY, "");
    return user;
  }
}
