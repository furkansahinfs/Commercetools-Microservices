import { Inject, Injectable, Scope } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { User } from "src/types";

@Injectable({ scope: Scope.REQUEST })
export class CTCartService {
  private authenticatedUser: User = this.request["user"];

  constructor(
    @Inject("MICROSERVICE_CART") private readonly ctCartClient: ClientProxy,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

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

  public async getMyCarts(dto) {
    return this.ctCartClient.send(
      { role: "carts/me", cmd: "get" },
      { dto, user: this.authenticatedUser },
    );
  }

  public async updateCart(dto) {
    return this.ctCartClient.send(
      { role: "carts/action", cmd: "post" },
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
