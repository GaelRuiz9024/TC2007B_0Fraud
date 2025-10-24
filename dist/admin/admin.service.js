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
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const admin_repository_1 = require("./admin.repository");
const user_service_1 = require("../users/user.service");
const hash_util_1 = require("../util/crypto/hash.util");
let AdminService = class AdminService {
    adminRepository;
    userDto;
    constructor(adminRepository, userDto) {
        this.adminRepository = adminRepository;
        this.userDto = userDto;
    }
    async registerAdmin(correo, nombre, apellidos, contrasena) {
        console.log("Aqui hacemos el hash del contrasena");
        const hashedcontrasena = (0, hash_util_1.sha256)(contrasena);
        return this.adminRepository.registerAdmin(correo, nombre, apellidos, hashedcontrasena);
    }
    async findById(id) {
        return this.adminRepository.findById(id);
    }
    async getAllUsers() {
        return this.adminRepository.getAllUsers();
    }
    async updateUserAdmin(id, updateData) {
        const existingUser = await this.adminRepository.updateUserAdmin(id, updateData);
        if (!existingUser) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const dataToUpdate = {};
        if (updateData.correo !== undefined) {
            dataToUpdate.correo = updateData.correo;
        }
        if (updateData.nombre !== undefined) {
            dataToUpdate.nombre = updateData.nombre;
        }
        if (updateData.contrasena !== undefined) {
            dataToUpdate.contrasena_hash = (0, hash_util_1.sha256)(updateData.contrasena);
        }
        return this.userDto.updateUser(id, dataToUpdate);
    }
    async updateRole(id, idRol) {
        const existingUser = await this.adminRepository.findById(id);
        if (!existingUser) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        return this.adminRepository.updateUserAdmin(id, { idRol });
    }
    async deleteUser(id) {
        const existingUser = await this.adminRepository.findById(id);
        if (!existingUser) {
            throw new common_1.NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await this.adminRepository.deleteUser(id);
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [admin_repository_1.AdminRepository,
        user_service_1.UserService])
], AdminService);
