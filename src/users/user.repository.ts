/* eslint-disable prettier/prettier */

import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

export type User= {
    id: number;
    email: string;
    name: string;
    password_hash: string;
    salt: string;
}


@Injectable()
export class UserRepository{
    constructor(private readonly dbService: DbService) {}

    async registerUser(email:string, 
        name:string, password:string):Promise<User|void>{
        const sql= `INSERT INTO users (email,name,password_hash,salt) VALUES ('${email}','${name}','${password}','saltTest')`;
        await this.dbService.getPool().query(sql);
    }
}


