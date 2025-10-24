import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

export type Category = {
    id: number;
    nombre: string;
    descripcion: string | null;
    activa: 0| 1;
}
const ALLOWED_FIELDS_CATEGORY = ['nombre', 'descripcion', 'activa'];
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

        // 🚨 CAMBIO CLAVE: Filtrar solo los campos permitidos y generar la cláusula SET
        const validFields = fields.filter(field => 
            ALLOWED_FIELDS_CATEGORY.includes(field)
        );

        if (validFields.length === 0) {
            // Si solo se envían campos no permitidos, lanzar un error o retornar.
            throw new Error("No hay datos válidos para actualizar");
        }

        // Crear la cláusula SET solo con los campos validados
        const setClause = validFields.map(field => `${field}=?`).join(', ');
        
        // Crear la lista de valores en el orden de `validFields`
        const updateValues = validFields.map(field => updateData[field]);
        
        const sql = `UPDATE categoria SET ${setClause} WHERE id=?`;

        // El uso de `?` y pasar los valores en un array es la clave para la seguridad contra inyección SQL.
        await this.dbService.getPool().query(sql, [...updateValues, id]);
        
        return this.findById(id);
    }    async deleteCategory(id: number): Promise<void> {
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