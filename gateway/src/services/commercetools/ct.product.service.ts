import { Injectable, Scope } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { conf } from "src/config";

@Injectable({ scope: Scope.REQUEST })
export class CTProductService {
  private ctProductClient: ClientProxy;

  constructor() {
    const host = conf.CLIENT_HOST;
    this.ctProductClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: {
        host,
        port: parseInt(conf.PRODUCT_CLIENT_PORT),
      },
    });
  }

  public getProducts(dto) {
    return this.ctProductClient.send({ role: "products", cmd: "get" }, { dto });
  }
}
