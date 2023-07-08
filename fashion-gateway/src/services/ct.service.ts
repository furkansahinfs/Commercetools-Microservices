import { Inject, Injectable, Scope } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { User } from "src/dto/user.dto";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@Injectable({ scope: Scope.REQUEST })
export class CTService {
  private ctProductClient: ClientProxy;
  private ctOrderClient: ClientProxy;
  private authenticatedUser: User = this.request["user"];

  constructor(@Inject(REQUEST) private readonly request: Request) {
    const host = process.env.CLIENT_HOST;
    this.ctProductClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port: parseInt(process.env.CT_PRODUCT_CLIENT_PORT),
      },
    });

    this.ctOrderClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port: parseInt(process.env.CT_ORDER_CLIENT_PORT),
      },
    });
  }

  public getProducts(dto) {
    return this.ctProductClient.send(
      { role: "/ct/products", cmd: "get" },
      { dto, user: this.authenticatedUser },
    );
  }

  public getOrders(dto) {
    return this.ctOrderClient.send(
      { role: "/ct/orders", cmd: "get" },
      { dto, user: this.authenticatedUser },
    );
  }
}
