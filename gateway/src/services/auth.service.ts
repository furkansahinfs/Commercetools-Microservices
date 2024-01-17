import { Inject, Injectable, Scope } from "@nestjs/common";
import { conf } from "src/config";
import { HttpService } from "@nestjs/axios";
import { Request } from "express";
import { REQUEST } from "@nestjs/core";
import { AxiosRequestConfig } from "axios";

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private host = "";
  private port = 0;

  constructor(
    private readonly httpService: HttpService,
    @Inject(REQUEST) private readonly request: Request,
  ) {
    this.host = conf.CLIENT_HOST;
    this.port = parseInt(conf.AUTH_PORT);
  }

  public async login(dto) {
    const path = "auth/login";

    return this.httpService.axiosRef
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
    return this.httpService.axiosRef
      .post(this.generateEndpoint(path), dto)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  }

  public async users(dto) {
    const path = "users";

    return this.httpService.axiosRef
      .get(this.generateEndpoint(path), {
        params: {
          ...dto,
        },
        headers: { Authorization: this.request.headers.authorization },
        user: this.request["user"],
      } as AxiosRequestConfig)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  }

  public async getMe(dto) {
    const path = "users/me";
    return this.httpService.axiosRef
      .get(this.generateEndpoint(path), {
        params: {
          ...dto,
        },
        headers: { Authorization: this.request.headers.authorization },
        user: this.request["user"],
      } as AxiosRequestConfig)
      .then((res) => res.data)
      .catch((err) => err.response.data);
  }

  private generateEndpoint(path: string) {
    return `http://${this.host}:${this.port}/${path}`;
  }
}
