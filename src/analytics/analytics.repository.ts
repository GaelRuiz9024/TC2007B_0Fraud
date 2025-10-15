import { Injectable } from "@nestjs/common";
import { DbService } from "../db/db.service";

export type ReportsByCategory= {
    categoryName: string;
    reportCount: number;
}

export type TopReportedSites= {
    urlPagina: string;
    reportCount: number;
}

export type ReportStatusCount= {
    estado: string;
    count: number;
}

@Injectable()
export class AnalyticsRepository{
    constructor(private readonly dbService: DbService){}

    async getReportsByCategory(): Promise<ReportsByCategory[]> {
        const sql = `
            SELECT 
                c.nombre AS categoryName, 
                COUNT(r.id) AS reportCount
            FROM 
                reporte r
            JOIN 
                categoria c ON r.idCategoria = c.id
            GROUP BY 
                c.nombre
            ORDER BY 
                reportCount DESC;
        `;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as ReportsByCategory[];
    }

    async getTopReportedSites(limit: number = 5): Promise<TopReportedSites[]> {
        const sql = `
            SELECT 
                r.urlPagina, 
                COUNT(r.id) AS reportCount
            FROM 
                reporte 
            GROUP BY
                urlPagina
            ORDER BY 
                reportCount DESC
            LIMIT ?;
        `;
        const [rows] = await this.dbService.getPool().query(sql, [limit]);
        return rows as TopReportedSites[];
    }

    async getReportStatusCounts(): Promise<ReportStatusCount[]> {
        const sql = `
            SELECT 
                estado,
                COUNT(*) AS count
            FROM 
                reporte
            GROUP BY 
                estado;
        `;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as ReportStatusCount[];
    }
}