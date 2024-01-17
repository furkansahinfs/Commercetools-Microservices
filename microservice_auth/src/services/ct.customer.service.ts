import { conf } from "src/config";
import { HttpService } from "@nestjs/axios";
import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { AxiosRequestConfig } from "axios";

@Injectable({ scope: Scope.REQUEST })
export class CTCustomerService {
  private host = "";
  private port = 0;
  private path = "customers/new";

  constructor(
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.host = conf.GATEWAY_HOST;
    this.port = parseInt(conf.GATEWAY_PORT);
  }

  public async createCustomer(dto) {
    const gatewayEndpoint = `http://${this.host}:${this.port}/${this.path}`;
    return this.httpService.axiosRef
      .post(gatewayEndpoint, dto, {
        headers: { Authorization: this.request.headers.authorization },
        user: this.request["user"],
      } as AxiosRequestConfig)
      .then((res) => res.data.data)
      .catch((err) => err.response.data);
  }
}
