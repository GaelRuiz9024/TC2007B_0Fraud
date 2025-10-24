"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const tokens_service_1 = require("../../auth/tokens.service");
let JwtAuthGuard = class JwtAuthGuard {
    tokenService;
    constructor(tokenService) {
        this.tokenService = tokenService;
    }
    async canActivate(ctx) {
        const request = ctx.switchToHttp().getRequest();
        const auth = request.headers.authorization ?? "";
        const [schema, token] = auth.split(" ");
        if (schema != "Bearer" || !token)
            throw new common_1.UnauthorizedException("Token invalido!!!!");
        try {
            const payload = await this.tokenService.verifyAccess(token);
            request.user = {
                id: Number(payload.sub),
                userId: payload.sub,
                profile: payload.profile,
                raw: payload
            };
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException("Token invalido!!!!");
        }
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tokens_service_1.TokenService])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map