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
exports.TokenService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const JWT_SECRET = process.env.JWT_SECRET;
let TokenService = class TokenService {
    jwtService;
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async generateAccess(profile) {
        return this.jwtService.signAsync({
            sub: profile.id,
            type: "access",
            profile: profile
        }, {
            expiresIn: "10m",
            secret: JWT_SECRET
        });
    }
    async generateRefresh(userId) {
        return this.jwtService.signAsync({
            sub: userId,
            type: "refresh"
        }, {
            expiresIn: "7d",
            secret: JWT_SECRET
        });
    }
    async verifyAccess(token) {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: JWT_SECRET
        });
        if (payload.type !== "access") {
            throw new Error("Invalid token type");
        }
        return payload;
    }
    async verifyRefresh(token) {
        const payload = await this.jwtService.verifyAsync(token, {
            secret: JWT_SECRET
        });
        if (payload.type !== "refresh") {
            throw new Error("Invalid token type");
        }
        return payload;
    }
};
exports.TokenService = TokenService;
exports.TokenService = TokenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], TokenService);
