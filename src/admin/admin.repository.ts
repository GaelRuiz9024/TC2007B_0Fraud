import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { UserRepository, User } from "src/users/user.repository";

export type Admin= {
    id: number;
    email: string;
    name: string;
    password_hash: string;
    salt: string;
}

@Injectable()
export class AdminRepository{
    constructor(
        private readonly dbService: DbService,
        private readonly userRepo: UserRepository
    ) {}
    async  registerAdmin(email:string, 
        name:string, password:string):Promise<Admin|void>{
        const sql= `INSERT INTO users (email,name,password_hash,salt,user_type) VALUES (?,?,?,'saltTest', 1)`;
        await this.dbService.getPool().query(sql, [email, name, password]);
    }

    async updateUserAdmin(id: number, updateData: Partial<User>): Promise<User> {
        // Construir la consulta SQL dinámicamente
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        if (fields.length === 0) {
            throw new Error("No hay datos para actualizar");
        }

        const setClause = fields.map(field => `${field}=?`).join(', ');
        const sql = `UPDATE users SET ${setClause} WHERE id=?`;
        
        // Agregar el ID al final de los valores
        values.push(id);
        
        await this.dbService.getPool().query(sql, values);
        
        // Retornar el usuario actualizado
        return this.userRepo.findById(id);
    }

    async getAllUsers():Promise<User>{
        const sql= `SELECT * FROM users WHERE user_type=0`;
        const [rows]= await this.dbService.getPool().query(sql, []);
        const result= rows as User[];
        return result[0];
    }
    
    async findById(id:number):Promise<User>{
        const sql= `SELECT * FROM users WHERE id=? LIMIT 1`;
        const [rows]= await this.dbService.getPool().query(sql, [id]);
        const result= rows as User[];
        return result[0];
    }


}