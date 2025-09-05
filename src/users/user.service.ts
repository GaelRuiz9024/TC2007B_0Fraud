/* eslint-disable prettier/prettier */

import { Injectable, UnauthorizedException } from "@nestjs/common";
import { User, UserRepository } from "./user.repository";
import { sha256 } from "src/util/crypto/hash.util";

export type UserDto={
    email: string;
    name: string;
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

}
