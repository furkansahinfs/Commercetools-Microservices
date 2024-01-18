import { Inject, Injectable, Scope } from "@nestjs/common";
import { conf } from "src/config";
import { HttpService } from "@nestjs/axios";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { AxiosInstance, AxiosRequestConfig } from "axios";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private axiosRef: AxiosInstance;
  private host = "";
  private port = 0;

  constructor(
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.axiosRef = this.httpService.axiosRef;
    this.host = conf.CLIENT_HOST;
    this.port = parseInt(conf.AUTH_PORT);
  }

  public async login(dto) {
    const path = "auth/login";

    return this.axiosRef
      .post(this.generateEndpoint(path), dto, {
        headers: {
          refresh_token: this.request.headers["refresh_token"],
        },
      } as AxiosRequestConfig)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  }

  public async register(dto) {
    const path = "auth/register";
    return this.axiosRef
      .post(this.generateEndpoint(path), dto)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  }

  public async users(dto) {
    const path = "users";

    return this.axiosRef
      .get(this.generateEndpoint(path), {
        params: {
          ...dto,
        },
        headers: {
          Authorization: this.request.headers.authorization,
        },
        user: this.request["user"],
      } as AxiosRequestConfig)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  }

  public async getMe() {
    const path = "users/me";

    return this.axiosRef
      .get(this.generateEndpoint(path), {
        headers: {
          Authorization: this.request.headers.authorization,
        },
        user: this.request["user"],
      } as AxiosRequestConfig)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  }

  private generateEndpoint(path: string) {
    return `http://${this.host}:${this.port}/${path}`;
  }
}
