/* eslint-disable prettier/prettier */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { TokenService } from "src/auth/tokens.service";
import { AuthenticatedRequest } from "../interfaces/authenticated-request";
@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}
    async canActivate(ctx: ExecutionContext): Promise<boolean>{
        const request = ctx.switchToHttp().getRequest<Request>();
        const auth = request.headers.authorization ?? "";
        const [schema, token] = auth.split(" ");
        if(schema!="Bearer" || !token)
            throw new UnauthorizedException("Token invalido!!!!");
        try{
            const payload = await this.tokenService.verifyAccess(token);
            (request as AuthenticatedRequest).user={
                id: Number(payload.sub),
                userId: payload.sub,
                profile:payload.profile,
                raw:payload
            }
            return true;
        }catch{
            throw new UnauthorizedException("Token invalido!!!!");
        }
    }
}