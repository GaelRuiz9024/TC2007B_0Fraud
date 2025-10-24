// src/tips/tips.repository.ts
import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

export type CiberTip = {
    id: number; 
    titulo: string;
    contenido: string;
}

@Injectable()
export class TipsRepository{
    constructor(private readonly dbService: DbService){}

    /**
     * Busca un tip por el día del año, que es el ID (1 a 366).
     * @param dayOfYear Número del día del año.
     * @returns El tip de ciberseguridad o null si no se encuentra.
     */
    async findTipByDay(dayOfYear: number): Promise<CiberTip | null> {
        const sql = `SELECT id, titulo, contenido FROM ciber_tip WHERE id = ? LIMIT 1`; 
        const [rows]: any = await this.dbService.getPool().query(sql, [dayOfYear]);
        
        if (rows.length === 0) {
            return null;
        }
        return rows[0] as CiberTip;
    }
}