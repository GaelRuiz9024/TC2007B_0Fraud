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
export type HistoricalReportData = {
    date: string; 
    categoryName: string;
    reportCount: number;
}

export type ReportsByMonth = {
    month: string;  
    reportCount: number;
}

@Injectable()
export class AnalyticsRepository{
    constructor(private readonly dbService: DbService){}
    
    async getHistoricalReportTrends(): Promise<HistoricalReportData[]> {
        const sql = `
            SELECT 
                DATE(r.fechaCreacion) AS date, 
                c.nombre AS categoryName, 
                COUNT(r.id) AS reportCount
            FROM 
                reporte r
            JOIN 
                categoria c ON r.idCategoria = c.id
            WHERE
                -- Filtra los reportes de los últimos 7 días
                r.fechaCreacion >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
            GROUP BY 
                date, categoryName
            ORDER BY 
                date ASC, categoryName ASC;
        `;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as HistoricalReportData[];
    }
    async getReportsByCategory(): Promise<ReportsByCategory[]> {
        const sql = `
            SELECT 
                c.nombre AS categoryName, 
                COUNT(r.id) AS reportCount
            FROM 
                categoria c  -- Empezamos desde la tabla categoria
            LEFT JOIN        -- Usamos LEFT JOIN para incluir categorías sin reportes
                reporte r ON r.idCategoria = c.id
            WHERE
                c.activa = 1   -- Opcional: solo categorías activas
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
                urlPagina, 
                COUNT(id) AS reportCount
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

    async getReportsByMonth(): Promise<ReportsByMonth[]> {
        const sql = `
            SELECT 
                DATE_FORMAT(fechaCreacion, '%Y-%m') AS month,
                COUNT(id) AS reportCount
            FROM 
                reporte
            GROUP BY 
                month
            ORDER BY 
                month ASC;
        `;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows as ReportsByMonth[];
    }
}