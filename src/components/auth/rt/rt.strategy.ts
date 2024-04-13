import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Request } from "express";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { JwtPayload, JwtRtPayload } from "../../../system/interfaces/index";
import appConfig from "../../../system/config.system/app.config";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: appConfig().rtSecret,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtRtPayload {
    const refreshToken = req
      ?.get("authorization")
      ?.replace("Bearer", "")
      .trim();

    if (!refreshToken) throw new ForbiddenException("Refresh token malformed");
    return {
      ...payload,
      refreshToken,
    };
  }
}
