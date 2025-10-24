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
exports.UserController = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
class CreateUserDto {
    correo;
    nombre;
    apellidos;
    contrasena;
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "user@example.com", description: "correo del usuario" }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "correo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Usuario Ejemplo", description: "Nombre del usuario", required: false }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Apellido Ejemplo", description: "Apellidos del usuario", required: false }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "apellidos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "contrsaena123", description: "Contraseña del usuario" }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "contrasena", void 0);
class UpdateUserDto {
    correo;
    nombre;
    apellidos;
    contrasena;
}
exports.UpdateUserDto = UpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "newcorreo@example.com", description: "Nuevo correo del usuario", required: false }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "correo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Nuevo Nombre", description: "Nuevo nombre del usuario", required: false }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Apellido Ejemplo", description: "Apellidos del usuario", required: false }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "apellidos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "newcontrsaena123", description: "Nueva contraseña del usuario", required: false }),
    __metadata("design:type", String)
], UpdateUserDto.prototype, "contrasena", void 0);
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async registerUser(userDto) {
        return this.userService.registerUser(userDto.correo, userDto.nombre, userDto.apellidos, userDto.contrasena);
    }
    async updateUser(req, updateDto) {
        const userId = Number(req.user.userId);
        return this.userService.updateUser(userId, updateDto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Usuario creado exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Error interno del servidor" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Put)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Usuario actualizado exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "No autorizado" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Usuario no encontrado" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Error interno del servidor" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)("Endpoints de Usuarios"),
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
