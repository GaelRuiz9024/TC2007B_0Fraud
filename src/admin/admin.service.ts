import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { Admin, AdminRepository } from "./admin.repository";
import { UpdateUserData,UserService,UserDto } from "src/users/user.service";
import { sha256 } from "src/util/crypto/hash.util";

export type AdminDto={
    email: string;
    name: string;
}

@Injectable()
export class AdminService {
    constructor(
        private readonly adminRepository: AdminRepository,
        private readonly userDto: UserService
    ) {}
    async registerAdmin(email:string, name:string, password:string):Promise<Admin|void>{
        console.log("Aqui hacemos el hash del password")
        const hashedPassword = sha256(password);
        return this.adminRepository.registerAdmin(email, name, hashedPassword);
    }

    async findById(id:number):Promise<UserDto>{
        return this.adminRepository.findById(id);
    }

    async getAllUsers():Promise<UserDto>{
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

        if (updateData.email !== undefined) {
            dataToUpdate.email = updateData.email;
        }
        if (updateData.name !== undefined) {
            dataToUpdate.name = updateData.name;
        }   
        if (updateData.password !== undefined) {
            dataToUpdate.password_hash = sha256(updateData.password);
        }
        return this.userDto.updateUser(id, dataToUpdate);
    }
}