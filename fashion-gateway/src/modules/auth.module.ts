import { Module } from "@nestjs/common";
import { AuthController } from "src/controller";
import {
  AuthService,
  CTCartService,
  CTCustomerService,
  CTOrderService,
} from "src/services";
import { PrismaService } from "src/services/prisma.service";

@Module({
  providers: [
    PrismaService,
    AuthService,
    CTCustomerService,
    CTCartService,
    CTOrderService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
