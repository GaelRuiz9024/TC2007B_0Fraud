/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";
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

}
