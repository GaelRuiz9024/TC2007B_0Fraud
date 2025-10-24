import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

export type Category = {
    id: number;
    nombre: string;
    descripcion: string | null;
    activa: 0| 1;
}

@Injectable()
export class CategoryRepository{
    constructor(private readonly dbService: DbService){}

    async createCategory(nombre: string, descripcion?: string, activa: 0|1=1): Promise<void>{
      const sql = `INSERT INTO categoria (nombre, descripcion, activa) VALUES (?, ?, ?)`;
        const params = [nombre, descripcion, activa];
        await this.dbService.getPool().query(sql, params);
    }
    async findAllCategories(): Promise<Category[]> {
        const sql = `SELECT * FROM categoria`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as Category[];
    }
    async updateCategory(id: number, updateData: Partial<Category>): Promise<Category | undefined> {
        const fieldsToUpdate = Object.keys(updateData).filter(key => 
            key !== 'id' && updateData[key as keyof Category] !== undefined
        );

        if (fieldsToUpdate.length === 0) {
            console.warn(`No valid fields provided to update category ${id}. Returning current data.`);
            return this.findById(id); 
        }

        const setClause = fieldsToUpdate.map(field => `\`${field}\`=?`).join(', '); // Usar backticks por si los nombres de campo son palabras reservadas

        const valuesToUpdate = fieldsToUpdate.map(field => updateData[field as keyof Category]);

        const sql = `UPDATE categoria SET ${setClause} WHERE id=?`;
        
        try {
            await this.dbService.getPool().query(sql, [...valuesToUpdate, id]);
        } catch (error) {
            console.error(`Error updating category ${id}:`, error);
            throw error; 
        }
        return this.findById(id);
    }
    async deleteCategory(id: number): Promise<void> {
        const sql = `UPDATE categoria SET activa=0 WHERE id=?`; 
        await this.dbService.getPool().query(sql, [id]);
    }
    async findById(id:number):Promise<Category>{
        const sql= `SELECT * FROM categoria WHERE id=? LIMIT 1`;
        const [rows]= await this.dbService.getPool().query(sql, [id]);
        const result= rows as Category[];
        return result[0];
    }

    
}
export class UsersCategoryRepository{
    constructor(private readonly dbService: DbService){}
    async findCategories(): Promise<Category[]> {
        const sql = `SELECT * FROM categoria WHERE activa = 1`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as Category[];
    }

}