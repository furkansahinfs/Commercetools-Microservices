import { Inject, Injectable, Scope } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { CTUser } from "src/dto/user.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { conf } from "src/config";

@Injectable({ scope: Scope.REQUEST })
export class CTOrderService {
  private ctOrderClient: ClientProxy;
  private authenticatedUser: CTUser = this.request["user"];

  constructor(@Inject(REQUEST) private readonly request: Request) {
    const host = conf.CLIENT_HOST;
    this.ctOrderClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port: parseInt(conf.CT_ORDER_CLIENT_PORT),
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
}
