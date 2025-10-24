import { CanActivate, ExecutionContext } from "@nestjs/common";
import { TokenService } from "src/auth/tokens.service";
import { JwtAuthGuard } from "./jwt-auth.guard";
export declare class IsAdminGuard extends JwtAuthGuard implements CanActivate {
    constructor(tokenService: TokenService);
    canActivate(ctx: ExecutionContext): Promise<boolean>;
}
