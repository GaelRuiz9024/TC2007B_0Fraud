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
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);

        if (fields.length === 0) {
            throw new Error("No hay datos para actualizar");
        }

        const setClause = fields.filter(field => field !== 'id').map(field => `${field}=?`).join(', ');
        const updateValues= values.slice(0,fields.length - (fields.includes('id')?1:0));
        
        const sql = `UPDATE categoria SET ${setClause} WHERE id=?`;

        await this.dbService.getPool().query(sql, [...updateValues, id]);
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
