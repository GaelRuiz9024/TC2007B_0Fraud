import { CanActivate, ExecutionContext } from "@nestjs/common";
import { TokenService } from "src/auth/tokens.service";
export declare class JwtAuthGuard implements CanActivate {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
