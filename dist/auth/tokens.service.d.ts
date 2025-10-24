import { JwtService } from "@nestjs/jwt";
export type UserProfile = {
    id: string;
    correo: string;
    nombre: string;
    idRol: number;
};
export type AccessPayload = {
    sub: string;
    type: "access";
    profile: UserProfile;
};
export type RefreshPayload = {
    sub: string;
    type: "refresh";
};
export declare class TokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    generateAccess(profile: UserProfile): Promise<string>;
    generateRefresh(userId: string): Promise<string>;
    verifyAccess(token: string): Promise<AccessPayload>;
    verifyRefresh(token: string): Promise<RefreshPayload>;
}
