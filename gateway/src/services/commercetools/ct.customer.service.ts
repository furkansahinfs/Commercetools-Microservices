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
export class CTCustomerService {
  private ctCustomerClient: ClientProxy;
  private authenticatedUser: User = this.request["user"];

  constructor(@Inject(REQUEST) private readonly request: Request) {
    const host = conf.CLIENT_HOST;

    this.ctCustomerClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port: parseInt(conf.CUSTOMER_CLIENT_PORT),
      },
    });
  }

  public async me(dto) {
    return this.ctCustomerClient.send(
      { role: "customers", cmd: "get-me" },
      { dto, user: this.authenticatedUser },
    );
  }

  public async getCustomers(dto) {
    return this.ctCustomerClient.send(
      { role: "customers", cmd: "get" },
      { dto, user: this.authenticatedUser },
    );
  }

  public async updateCustomer(dto) {
    return this.ctCustomerClient.send(
      { role: "customers", cmd: "patch" },
      { dto, user: this.authenticatedUser },
    );
  }

  public async createCustomer(dto) {
    return this.ctCustomerClient.send(
      { role: "customers", cmd: "post" },
      { dto, user: this.authenticatedUser },
    );
  }

  public async deleteCustomer(dto) {
    return this.ctCustomerClient.send(
      { role: "customers", cmd: "delete" },
      { dto, user: this.authenticatedUser },
    );
  }
}
