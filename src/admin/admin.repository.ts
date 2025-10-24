import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";
import { UserRepository, User } from "src/users/user.repository";

export type Admin= {
    id: number;
    correo: string;
    nombre: string;
    apellidos: string;
    contrasenaHash: string;
    salt: string;
}
const ALLOWED_ADMIN_UPDATE_FIELDS = ['correo', 'nombre', 'apellidos', 'contrasenaHash', 'salt', 'idRol'];
@Injectable()
export class AdminRepository{
    constructor(
        private readonly dbService: DbService,
        private readonly userRepo: UserRepository
    ) {}
    async  registerAdmin(correo:string, 
        nombre:string, apellidos:string,contrasena:string):Promise<Admin|void>{
        const sql= `INSERT INTO usuario (correo,nombre,apellidos,contrasenaHash,salt,idRol) VALUES (?,?,?,?,'saltTest', 1)`;
        await this.dbService.getPool().query(sql, [correo, nombre,apellidos, contrasena]);
    }

    async updateUserAdmin(id: number, updateData: Partial<User>): Promise<User> {
        // Construir la consulta SQL dinámicamente
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        
        if (fields.length === 0) {
            throw new Error("No hay datos para actualizar");
        }
        const validFields = fields.filter(field => ALLOWED_ADMIN_UPDATE_FIELDS.includes(field));

        if (validFields.length === 0) {
            throw new Error("No hay datos válidos para actualizar");
        }
        const setClause = validFields.map(field => `${field}=?`).join(', '); 
        const sql = `UPDATE usuario SET ${setClause} WHERE id=?`;
        
        values.push(id);
        
        await this.dbService.getPool().query(sql, values);
        
        return this.userRepo.findById(id);
    }

    async getAllUsers(): Promise<User[]> {
        const sql = `SELECT * FROM usuario WHERE idRol=2 AND activo=1`;
        const [rows] = await this.dbService.getPool().query(sql, []);
        return rows as User[]; 
    }
    async deleteUser(id: number): Promise<void> {
        const sql = `UPDATE usuario SET activo=0 WHERE id=?`; 
        await this.dbService.getPool().query(sql, [id]);
    }
    
    async findById(id:number):Promise<User>{
        const sql= `SELECT * FROM usuario WHERE id=? LIMIT 1`;
        const [rows]= await this.dbService.getPool().query(sql, [id]);
        const result= rows as User[];
        return result[0];
    }


}