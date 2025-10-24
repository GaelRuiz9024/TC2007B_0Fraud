"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRepository = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../db/db.service");
let AnalyticsRepository = class AnalyticsRepository {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    async getHistoricalReportTrends() {
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
        return rows;
    }
    async getReportsByCategory() {
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
        return rows;
    }
    async getTopReportedSites(limit = 5) {
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
        return rows;
    }
    async getReportStatusCounts() {
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
        return rows;
    }
    async getReportsByMonth() {
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
        return rows;
    }
};
exports.AnalyticsRepository = AnalyticsRepository;
exports.AnalyticsRepository = AnalyticsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], AnalyticsRepository);
