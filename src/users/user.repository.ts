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

    async findByEmail(email:string):Promise<User>{
        const sql= `SELECT * FROM users WHERE email='${email}' LIMIT 1`;
        const [rows]= await this.dbService.getPool().query(sql);
        const result= rows as User[];
        return result[0];
    }
    async findById(id:number):Promise<User>{
        const sql= `SELECT * FROM users WHERE id='${id}' LIMIT 1`;
        const [rows]= await this.dbService.getPool().query(sql);
        const result= rows as User[];
        return result[0];
    }
}


