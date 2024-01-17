import { Inject, Injectable, Scope } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";

@Injectable({ scope: Scope.REQUEST })
export class CTProductService {
  constructor(
    @Inject("MICROSERVICE_PRODUCT")
    private readonly ctProductClient: ClientProxy,
  ) {}

  public getProducts(dto) {
    return this.ctProductClient.send({ role: "products", cmd: "get" }, { dto });
  }
}
