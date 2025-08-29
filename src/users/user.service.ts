/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { UserRepository } from "./user.repository";

export type UserDto={
    email: string;
    name: string;
}

@Injectable()
export class UserService {
    constructor(private readonly userRepository: UserRepository) {}

    async registerUser(email:string, name:string, password:string):Promise<UserDto|void>{
        console.log("Aqui hacemos el hash del password")
        return this.userRepository.registerUser(email, name, password);
    }

}
