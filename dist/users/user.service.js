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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./user.repository");
const hash_util_1 = require("../util/crypto/hash.util");
let UserService = class UserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async registerUser(correo, nombre, apellidos, contrasena) {
        console.log("Aqui hacemos el hash del contrasena");
        const hashedcontrasena = (0, hash_util_1.sha256)(contrasena);
        return this.userRepository.registerUser(correo, nombre, apellidos, hashedcontrasena);
    }
    async login(correo, contrasena) {
        const user = await this.userRepository.findByEmail(correo);
        if (!user)
            throw Error("Usuario no encontrado");
        if (user.contrasenaHash !== (0, hash_util_1.sha256)(contrasena)) {
            throw new common_1.UnauthorizedException("Contraseña incorrecta");
        }
        return user;
    }
    async findById(id) {
        return this.userRepository.findById(id);
    }
    async updateUser(id, updateData) {
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new common_1.NotFoundException("Usuario no encontrado");
        }
        const dataToUpdate = {};
        if (updateData.correo !== undefined) {
            dataToUpdate.correo = updateData.correo;
        }
        if (updateData.correo !== undefined) {
            dataToUpdate.nombre = updateData.nombre;
        }
        if (updateData.contrasena !== undefined) {
            dataToUpdate.contrasenaHash = (0, hash_util_1.sha256)(updateData.contrasena);
        }
        if (Object.keys(dataToUpdate).length === 0) {
            return {
                correo: existingUser.correo,
                nombre: existingUser.nombre,
                apellidos: existingUser.apellidos
            };
        }
        const updatedUser = await this.userRepository.updateUser(id, dataToUpdate);
        return {
            correo: updatedUser.correo,
            nombre: updatedUser.nombre,
            apellidos: updatedUser.apellidos
        };
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository])
], UserService);
//# sourceMappingURL=user.service.js.map