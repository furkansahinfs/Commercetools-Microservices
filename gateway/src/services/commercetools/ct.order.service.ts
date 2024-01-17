import { Inject, Injectable, Scope } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { User } from "src/types";

@Injectable({ scope: Scope.REQUEST })
export class CTOrderService {
  private authenticatedUser: User = this.request["user"];

  constructor(
    @Inject("MICROSERVICE_ORDER")
    private readonly ctOrderClient: ClientProxy,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  public getOrders(dto) {
    return this.ctOrderClient.send(
      { role: "orders", cmd: "get" },
      { dto, user: this.authenticatedUser },
    );
  }

  public getMyOrders(dto) {
    return this.ctOrderClient.send(
      { role: "orders", cmd: "get-me" },
      { dto, user: this.authenticatedUser },
    );
  }

  public createOrder(dto) {
    return this.ctOrderClient.send(
      { role: "orders", cmd: "post" },
      { dto, user: this.authenticatedUser },
    );
  }
}
