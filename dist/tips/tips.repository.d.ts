import { DbService } from "src/db/db.service";
export interface Tip {
    id: number;
    titulo: string;
    contenido: string;
}
export declare class TipsRepository {
    private readonly db;
    constructor(db: DbService);
    getTipByDayOfYear(dayOfYear: number): Promise<Tip | null>;
}
