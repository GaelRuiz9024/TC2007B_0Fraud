import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Admin, AdminRepository } from "./admin.repository";
import { UpdateUserData,UserService,UserDto } from "src/users/user.service";
import { sha256 } from "src/util/crypto/hash.util";

export type AdminDto={
    correo: string;
    nombre: string;
    apellidos: string;
}

@Injectable()
export class AdminService {
    constructor(
        private readonly adminRepository: AdminRepository,
    ) {}
    async registerAdmin(correo: string, nombre: string, apellidos:string, contrasena: string): Promise<Admin | void> {
        console.log("Aqui hacemos el hash del contrasena");
        const hashedcontrasena = sha256(contrasena);
        return this.adminRepository.registerAdmin(correo, nombre, apellidos, hashedcontrasena);
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
        if (updateData.apellidos !== undefined) { 
            dataToUpdate.apellidos = updateData.apellidos;
        }

        if (updateData.contrasena !== undefined) {
            dataToUpdate.contrasenaHash = sha256(updateData.contrasena);
        }
       const updatedUser = await this.adminRepository.updateUserAdmin(id, dataToUpdate);
        
        return {
            correo: updatedUser.correo,
            nombre: updatedUser.nombre,
            apellidos: updatedUser.apellidos
        };
    }

     async updateRole(id: number, idRol: number): Promise<UserDto> {
        const existingUser = await this.adminRepository.findById(id);
        if (!existingUser) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        
        // El AdminRepository ya tiene un método para actualizar, lo estoy reutilizando para el rol
       return this.adminRepository.updateUserAdmin(id, { idRol });
    }

    async deleteUser(id: number): Promise<void> {
        const existingUser = await this.adminRepository.findById(id);
        if (!existingUser) {
            throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
        }
        await this.adminRepository.deleteUser(id);
    }
}