
import { Injectable } from "@nestjs/common";
import { DbService } from "src/db/db.service";

export interface Tip {
    id: number;
    titulo: string;
    contenido: string;
}

@Injectable()
export class TipsRepository {
    constructor(private readonly db: DbService) {}

    async getTipByDayOfYear(dayOfYear: number): Promise<Tip | null> {
        const sql = "SELECT id, titulo, contenido FROM ciber_tip WHERE id = ?";
        const [rows] = await this.db.getPool().query(sql, [dayOfYear]);

        const result = rows as Tip[];
        if (result && result.length > 0) {
            return result[0];
        }

        return null;
    }
}
