import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Admin, AdminRepository } from "./admin.repository";
import { UpdateUserData,UserService,UserDto } from "src/users/user.service";
import { sha256 } from "src/util/crypto/hash.util";

export type AdminDto={
    correo: string;
    nombre: string;
}

@Injectable()
export class AdminService {
    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly userDto: UserService
    ) {}
    async registerAdmin(correo: string, nombre: string, contrasena: string): Promise<Admin | void> {
        console.log("Aqui hacemos el hash del contrasena");
        const hashedcontrasena = sha256(contrasena);
        return this.adminRepository.registerAdmin(correo, nombre, hashedcontrasena);
    }

    async findById(id:number):Promise<UserDto>{
        return this.adminRepository.findById(id);
    }

    async getAllUsers():Promise<UserDto[]>{
        return this.adminRepository.getAllUsers();
    }
    async updateUserAdmin(id: number, updateData: Partial<UpdateUserData>): Promise<AdminDto> {
        // Verificar que el usuario existe
        const existingUser = await this.adminRepository.updateUserAdmin(id, updateData);
        if (!existingUser) {
            throw new NotFoundException("Usuario no encontrado");
        }

        // Preparar los datos a actualizar
        const dataToUpdate: any = {};

        if (updateData.correo !== undefined) {
            dataToUpdate.correo = updateData.correo;
        }
        if (updateData.nombre !== undefined) {
            dataToUpdate.nombre = updateData.nombre;
        }   
        if (updateData.contrasena !== undefined) {
            dataToUpdate.contrasena_hash = sha256(updateData.contrasena);
        }
        return this.userDto.updateUser(id, dataToUpdate);
    }
}