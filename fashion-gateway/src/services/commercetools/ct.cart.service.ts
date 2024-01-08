import { Inject, Injectable, Scope } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { User } from "src/dto/user.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { conf } from "src/config";

@Injectable({ scope: Scope.REQUEST })
export class CTCartService {
  private ctCartClient: ClientProxy;
  private authenticatedUser: User = this.request["user"];

  constructor(@Inject(REQUEST) private readonly request: Request) {
    const host = conf.CLIENT_HOST;

    this.ctCartClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port: parseInt(conf.CT_ORDER_CLIENT_PORT),
      },
    });
  }

  public async createCart(dto) {
    return this.ctCartClient.send(
      { role: "carts", cmd: "post" },
      { dto, user: this.authenticatedUser },
    );
  }

  public async getCarts(dto) {
    return this.ctCartClient.send(
      { role: "carts", cmd: "get" },
      { dto, user: this.authenticatedUser },
    );
  }

  public async updateCart(dto) {
    return this.ctCartClient.send(
      { role: "carts", cmd: "patch" },
      { dto, user: this.authenticatedUser },
    );
  }

  public async deleteCart(dto) {
    return this.ctCartClient.send(
      { role: "carts", cmd: "delete" },
      { dto, user: this.authenticatedUser },
    );
  }
}
