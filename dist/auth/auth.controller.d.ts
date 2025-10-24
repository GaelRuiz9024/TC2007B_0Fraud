import { UserService } from "src/users/user.service";
import { TokenService } from "./tokens.service";
import type { AuthenticatedRequest } from "src/common/interfaces/authenticated-request";
export declare class LoginDto {
    correo: string;
    contrasena: string;
}
export declare class AuthController {
    private readonly tokenService;
    private readonly userService;
    constructor(tokenService: TokenService, userService: UserService);
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    getProfile(req: AuthenticatedRequest): {
        profile: import("./tokens.service").UserProfile;
    };
    refresh(dto: {
        refreshToken: string;
    }): Promise<{
        accessToken: string;
    }>;
}
