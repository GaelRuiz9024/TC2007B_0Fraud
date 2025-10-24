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
exports.adminController = exports.UpdateUserRoleDto = exports.AdminUpdateUserDto = exports.CreateAdminDto = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const swagger_1 = require("@nestjs/swagger");
const is_admin_guard_1 = require("../common/guards/is-admin.guard");
const class_validator_1 = require("class-validator");
class CreateAdminDto {
    correo;
    nombre;
    apellidos;
    contrasena;
}
exports.CreateAdminDto = CreateAdminDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "user@example.com", description: "correo del administrador" }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "correo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Usuario Ejemplo", description: "Nombre del administrador", required: false }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Apellido Ejemplo", description: "Apellidos del administrador", required: false }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "apellidos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "contrasena123", description: "Contraseña del administrador" }),
    __metadata("design:type", String)
], CreateAdminDto.prototype, "contrasena", void 0);
class AdminUpdateUserDto {
    correo;
    nombre;
    apellidos;
    contrasena;
}
exports.AdminUpdateUserDto = AdminUpdateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "newcorreo@example.com", description: "Nuevo correo del administrador", required: false }),
    __metadata("design:type", String)
], AdminUpdateUserDto.prototype, "correo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Nuevo Nombre", description: "Nuevo nombre del administrador", required: false }),
    __metadata("design:type", String)
], AdminUpdateUserDto.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Apellido Ejemplo", description: "Apellidos del administrador", required: false }),
    __metadata("design:type", String)
], AdminUpdateUserDto.prototype, "apellidos", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "newcontrasena123", description: "Nueva contraseña del administrador", required: false }),
    __metadata("design:type", String)
], AdminUpdateUserDto.prototype, "contrasena", void 0);
class UpdateUserRoleDto {
    idRol;
}
exports.UpdateUserRoleDto = UpdateUserRoleDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 2, description: 'Nuevo ID de Rol (1: Admin, 2: User)', enum: [1, 2] }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsIn)([1, 2]),
    __metadata("design:type", Number)
], UpdateUserRoleDto.prototype, "idRol", void 0);
let adminController = class adminController {
    adminService;
    constructor(adminService) {
        this.adminService = adminService;
    }
    async registerUser(userDto) {
        const admin = await this.adminService.registerAdmin(userDto.correo, userDto.nombre, userDto.apellidos, userDto.contrasena);
        if (!admin)
            return;
        return {
            correo: admin.correo,
            nombre: admin.nombre,
        };
    }
    async updateUser(id, updateDto) {
        const userId = Number(id);
        return this.adminService.updateUserAdmin(userId, updateDto);
    }
    async updateRole(id, updateRoleDto) {
        const userId = Number(id);
        return this.adminService.updateRole(userId, updateRoleDto.idRol);
    }
    async deleteUser(id) {
        const userId = Number(id);
        await this.adminService.deleteUser(userId);
    }
    async getAllUsers() {
        return this.adminService.getAllUsers();
    }
    async getUserById(id) {
        const userId = Number(id);
        return this.adminService.findById(userId);
    }
};
exports.adminController = adminController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Cuenta de administrador creada exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Error interno del servidor" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAdminDto]),
    __metadata("design:returntype", Promise)
], adminController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Put)("user/:id"),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "usuario actualizado exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "No autorizado" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Usuario no encontrado" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Error interno del servidor" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, AdminUpdateUserDto]),
    __metadata("design:returntype", Promise)
], adminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Put)("user/:id/role"),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar el rol de un usuario por ID (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Rol de usuario actualizado exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Usuario no encontrado" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateUserRoleDto]),
    __metadata("design:returntype", Promise)
], adminController.prototype, "updateRole", null);
__decorate([
    (0, common_1.Delete)("user/:id"),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar un usuario por ID (Admin)' }),
    (0, swagger_1.ApiResponse)({ status: 204, description: "Usuario eliminado exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Usuario no encontrado" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], adminController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)("user/list"),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Lista de usuarios obtenida exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "No autorizado" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Error interno del servidor" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], adminController.prototype, "getAllUsers", null);
__decorate([
    (0, common_1.Get)("user/:id"),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Usuario obtenido exitosamente" }),
    (0, swagger_1.ApiResponse)({ status: 401, description: "No autorizado" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Usuario no encontrado" }),
    (0, swagger_1.ApiResponse)({ status: 500, description: "Error interno del servidor" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], adminController.prototype, "getUserById", null);
exports.adminController = adminController = __decorate([
    (0, swagger_1.ApiTags)("Endpoints de Administradores"),
    (0, common_1.Controller)("admin"),
    __metadata("design:paramtypes", [admin_service_1.AdminService])
], adminController);
