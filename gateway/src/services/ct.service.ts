import { Inject, Injectable, Scope } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { TCPRoute, User } from "src/types";

@Injectable({ scope: Scope.REQUEST })
export class CTService {
  private authenticatedUser: User = this.request["user"];
  private routeJSON: TCPRoute;

  constructor(
    @Inject("MICROSERVICE_CART") private readonly ctCartClient: ClientProxy,
    @Inject("MICROSERVICE_CUSTOMER")
    private readonly ctCustomerClient: ClientProxy,
    @Inject("MICROSERVICE_ORDER")
    private readonly ctOrderClient: ClientProxy,
    @Inject("MICROSERVICE_PRODUCT")
    private readonly ctProductClient: ClientProxy,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.routeJSON = require("../config/routes/TCPRoute.json");
  }

  public async send(path: string, cmd: string, dto: any) {
    const client: ClientProxy = this.getClient(path);
    const message = this.routeJSON[path][cmd].message;
    const sendUser = this.routeJSON[path][cmd].sendUser;
    return client.send(message, {
      dto,
      user: sendUser ? this.authenticatedUser : undefined,
    });
  }

  private getClient(path: string) {
    switch (path) {
      case "carts":
        return this.ctCartClient;
      case "customers":
        return this.ctCustomerClient;
      case "orders":
        return this.ctOrderClient;
      case "products":
        return this.ctProductClient;
      default:
        break;
    }
  }
}
