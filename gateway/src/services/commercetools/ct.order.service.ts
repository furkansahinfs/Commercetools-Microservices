import { Inject, Injectable, Scope } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { conf } from "src/config";
import { User } from "src/types";

@Injectable({ scope: Scope.REQUEST })
export class CTOrderService {
  private ctOrderClient: ClientProxy;
  private authenticatedUser: User = this.request["user"];

  constructor(@Inject(REQUEST) private readonly request: Request) {
    const host = conf.CLIENT_HOST;
    this.ctOrderClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port: parseInt(conf.ORDER_CLIENT_PORT),
      },
    });
  }

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
