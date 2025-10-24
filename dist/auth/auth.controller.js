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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = exports.LoginDto = void 0;
const user_service_1 = require("../users/user.service");
const tokens_service_1 = require("./tokens.service");
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class LoginDto {
    correo;
    contrasena;
}
exports.LoginDto = LoginDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: 'El correo debe ser una dirección de correo válida.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'El correo es obligatorio.' }),
    __metadata("design:type", String)
], LoginDto.prototype, "correo", void 0);
__decorate([
    (0, class_validator_1.IsString)({ message: 'La contraseña debe ser una cadena de texto.' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'La contraseña es obligatoria.' }),
    __metadata("design:type", String)
], LoginDto.prototype, "contrasena", void 0);
let AuthController = class AuthController {
    tokenService;
    userService;
    constructor(tokenService, userService) {
        this.tokenService = tokenService;
        this.userService = userService;
    }
    async login(dto) {
        const usuario = await this.userService.login(dto.correo, dto.contrasena);
        if (!usuario)
            throw Error("Usuario no encontrado");
        const userProfile = { id: usuario.id.toString(), correo: usuario.correo, nombre: usuario.nombre, apellidos: usuario.apellidos, idRol: usuario.idRol };
        const accessToken = await this.tokenService.generateAccess(userProfile);
        const refreshToken = await this.tokenService.generateRefresh(usuario.id.toString());
        return { accessToken, refreshToken };
    }
    getProfile(req) {
        return { profile: req.user.profile };
    }
    async refresh(dto) {
        try {
            const profile = await this.tokenService.verifyRefresh(dto.refreshToken);
            const user = await this.userService.findById(Number(profile.sub));
            if (!user)
                throw Error("Usuario no encontrado");
            const newAccessToken = await this.tokenService.generateAccess({ id: user.id.toString(), correo: user.correo, nombre: user.nombre, idRol: user.idRol });
            return { accessToken: newAccessToken };
        }
        catch {
            throw Error("Token de refresco inválido");
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)("profile"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)("refresh"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [tokens_service_1.TokenService,
        user_service_1.UserService])
], AuthController);
