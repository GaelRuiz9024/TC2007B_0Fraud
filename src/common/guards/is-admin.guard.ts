/* eslint-disable prettier/prettier */

import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { TokenService } from "src/auth/tokens.service";
import { AuthenticatedRequest } from "../interfaces/authenticated-request";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Injectable()
export class IsAdminGuard extends JwtAuthGuard implements CanActivate {
    constructor(tokenService: TokenService) {
        super(tokenService);
    }
    async canActivate(ctx: ExecutionContext): Promise<boolean>{
        await super.canActivate(ctx);
        const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();
        if(request.user.profile.idRol !== 1){
            throw new UnauthorizedException("Acceso no autorizado: Se requiere rol de administrador");
        }
        return true;
    }
}