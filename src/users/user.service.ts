
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User, UserRepository } from "./user.repository";
import { sha256 } from "src/util/crypto/hash.util";

export type UserDto={
    correo: string;
    nombre: string;
    apellidos: string;
}

export interface UpdateUserData {
    correo?: string;
    nombre?: string;
    contrasena?: string;
}

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async registerUser(correo:string, nombre:string,apellidos:string, contrasena:string):Promise<UserDto|void>{
        console.log("Aqui hacemos el hash del contrasena")
        const hashedcontrasena = sha256(contrasena);
        return this.userRepository.registerUser(correo, nombre,apellidos, hashedcontrasena);
    }

    async login(correo:string, contrasena:string):Promise<User>{
        const user= await this.userRepository.findByEmail(correo);
        if(!user) throw Error("Usuario no encontrado");
        if(user.contrasenaHash !== sha256(contrasena)){
            throw new UnauthorizedException("Contraseña incorrecta");
        }
        return user;
    }

    async findById(id:number):Promise<User>{
        return this.userRepository.findById(id);
    }

    async updateUser(id: number, updateData: UpdateUserData): Promise<UserDto> {
        // Verificar que el usuario existe
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new NotFoundException("Usuario no encontrado");
        }

        // Preparar los datos a actualizar
        const dataToUpdate: any = {};
        
        if (updateData.correo !== undefined) {
            dataToUpdate.correo = updateData.correo;
        }
        
        if (updateData.correo !== undefined) {
            dataToUpdate.nombre = updateData.nombre;
        }
        
        if (updateData.contrasena !== undefined) {
            dataToUpdate.contrasenaHash = sha256(updateData.contrasena);
        }

        // Si no hay datos para actualizar, retornar los datos actuales
        if (Object.keys(dataToUpdate).length === 0) {
            return {
                correo: existingUser.correo,
                nombre: existingUser.nombre,
                apellidos: existingUser.apellidos
            };
        }

        // Actualizar el usuario
        const updatedUser = await this.userRepository.updateUser(id, dataToUpdate);
        
        return {
            correo: updatedUser.correo,
            nombre: updatedUser.nombre,
            apellidos: updatedUser.apellidos
        };
    }
}