
import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";


export type User= {
    id: number;
    correo: string;
    nombre: string;
    apellidos: string;
    contrasenaHash: string;
    salt: string;
    idRol: number; 
}

const ALLOWED_USER_FIELDS = ['correo', 'nombre', 'apellidos', 'contrasenaHash', 'salt', 'idRol'];
@Injectable()
export class UserRepository{
    constructor(private readonly dbService: DbService) {}

    async registerUser(correo:string, 
        nombre:string, apellidos:string, contrasena:string):Promise<User|void>{
        const sql= `INSERT INTO usuario (correo,nombre,apellidos,contrasenaHash,salt) VALUES (?,?,?,?,'saltTest')`;
        await this.dbService.getPool().query(sql, [correo, nombre,apellidos, contrasena]);
    }

    async findByEmail(correo:string):Promise<User>{
        const sql= `SELECT * FROM usuario WHERE correo=? LIMIT 1`;
        const [rows]= await this.dbService.getPool().query(sql, [correo]);
        const result= rows as User[];
        return result[0];
    }
    
    async findById(id:number):Promise<User>{
        const sql= `SELECT * FROM usuario WHERE id=? LIMIT 1`;
        const [rows]= await this.dbService.getPool().query(sql, [id]);
        const result= rows as User[];
        return result[0];
    }

    async updateUser(id: number, updateData: Partial<User>): Promise<User> {
        // Construir la consulta SQL dinámicamente
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        if (fields.length === 0) {
            throw new Error("No hay datos para actualizar");
        }
        const validFields = fields.filter(field => ALLOWED_USER_FIELDS.includes(field));

        if (validFields.length === 0) {
            throw new Error("No hay datos válidos para actualizar");
        }
        const setClause = validFields.map(field => `${field}=?`).join(', ');
        const sql = `UPDATE usuario SET ${setClause} WHERE id=?`;
        
        // Agregar el ID al final de los valores
        values.push(id);
        
        await this.dbService.getPool().query(sql, values);
        
        // Retornar el usuario actualizado
        return this.findById(id);
    }
}