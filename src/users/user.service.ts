/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { User, UserRepository } from "./user.repository";
import { sha256 } from "src/util/crypto/hash.util";

export type UserDto={
    email: string;
    name: string;
}

export interface UpdateUserData {
    email?: string;
    name?: string;
    password?: string;
}

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async registerUser(email:string, name:string, password:string):Promise<UserDto|void>{
        console.log("Aqui hacemos el hash del password")
        const hashedPassword = sha256(password);
        return this.userRepository.registerUser(email, name, hashedPassword);
    }

    async login(email:string, password:string):Promise<User>{
        const user= await this.userRepository.findByEmail(email);
        if(!user) throw Error("Usuario no encontrado");
        if(user.password_hash !== sha256(password)){
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
        
        if (updateData.email !== undefined) {
            dataToUpdate.email = updateData.email;
        }
        
        if (updateData.name !== undefined) {
            dataToUpdate.name = updateData.name;
        }
        
        if (updateData.password !== undefined) {
            dataToUpdate.password_hash = sha256(updateData.password);
        }

        // Si no hay datos para actualizar, retornar los datos actuales
        if (Object.keys(dataToUpdate).length === 0) {
            return {
                email: existingUser.email,
                name: existingUser.name
            };
        }

        // Actualizar el usuario
        const updatedUser = await this.userRepository.updateUser(id, dataToUpdate);
        
        return {
            email: updatedUser.email,
            name: updatedUser.name
        };
    }
}