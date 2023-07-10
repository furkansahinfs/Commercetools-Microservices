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
export class CTService {
  private ctProductClient: ClientProxy;
  private ctOrderClient: ClientProxy;
  private ctCustomerClient: ClientProxy;
  private authenticatedUser: User = this.request["user"];

  constructor(@Inject(REQUEST) private readonly request: Request) {
    const host = conf.CLIENT_HOST;
    this.ctProductClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port: parseInt(conf.CT_PRODUCT_CLIENT_PORT),
      },
    });

    this.ctOrderClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port: parseInt(conf.CT_ORDER_CLIENT_PORT),
      },
    });

    this.ctCustomerClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port: parseInt(conf.CT_CUSTOMER_CLIENT_PORT),
      },
    });
  }

  public getProducts(dto) {
    return this.ctProductClient.send(
      { role: "/ct/products", cmd: "get" },
      { dto, user: this.authenticatedUser },
    );
  }

  public async createCustomer(dto) {
    return this.ctCustomerClient.send(
      { role: "/ct/customers", cmd: "create" },
      { dto, user: this.authenticatedUser },
    );
  }

  public async me(dto) {
    return this.ctCustomerClient.send(
      { role: "/ct/customers", cmd: "get-me" },
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
