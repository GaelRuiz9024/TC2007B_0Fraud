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
exports.ReportRepository = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../db/db.service");
let ReportRepository = class ReportRepository {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    async getImagesForReport(reportId) {
        const sql = `SELECT urlImagen FROM imagen_reporte WHERE idReporte = ? ORDER BY fechaSubida ASC`;
        const [rows] = await this.dbService.getPool().query(sql, [reportId]);
        const images = rows;
        return images.map(img => img.urlImagen);
    }
    async enrichReportWithImages(report) {
        const images = await this.getImagesForReport(report.id);
        return {
            ...report,
            imagenes: images,
        };
    }
    async enrichReportsList(reports) {
        const enrichedReportsPromises = reports.map(report => this.enrichReportWithImages(report));
        return Promise.all(enrichedReportsPromises);
    }
    async addImageToReport(reportId, imageUrl) {
        const sql = `INSERT INTO imagen_reporte (idReporte, urlImagen, fechaSubida) VALUES (?, ?, NOW())`;
        const params = [reportId, imageUrl];
        await this.dbService.getPool().query(sql, params);
    }
    async createReport(report, userId) {
        const sql = `INSERT INTO reporte (idUsuario, titulo, descripcion, urlPagina, idCategoria, estado, fechaCreacion) VALUES (?, ?, ?, ?, ?, ?, NOW()) `;
        const params = [userId, report.titulo, report.descripcion, report.urlPagina, report.idCategoria || null, 'Pendiente'];
        await this.dbService.getPool().query(sql, params);
    }
    async findReportsByUserId(userId) {
        const sql = `SELECT * FROM reporte WHERE idUsuario = ?`;
        const [rows] = await this.dbService.getPool().query(sql, [userId]);
        const reports = rows;
        return this.enrichReportsList(reports);
    }
    async findAllReports() {
        const sql = `SELECT * FROM reporte`;
        const [rows] = await this.dbService.getPool().query(sql, []);
        const reports = rows;
        return this.enrichReportsList(reports);
    }
    async updateReportStatus(reportId, status, adminId) {
        const sql = `UPDATE reporte SET estado = ?, idAdminAprobador = ?, fechaRevision = NOW() WHERE id = ?`;
        const params = [status, adminId, reportId];
        await this.dbService.getPool().query(sql, params);
    }
    async searchReportsByKeyword(keyword) {
        const sql = `
            SELECT
                r.id,
                r.titulo,
                r.descripcion,
                r.urlPagina AS url,
                r.fechaCreacion,
                r.estado,
                c.nombre AS categoriaNombre,
                u.nombre AS autorNombre,
                u.apellidos AS autorApellidos
            FROM reporte r
            LEFT JOIN categoria c ON r.idCategoria = c.id
            LEFT JOIN usuario u ON r.idUsuario = u.id
            WHERE (
                r.titulo LIKE ?
                OR r.descripcion LIKE ?
                OR r.urlPagina LIKE ?
                OR c.nombre LIKE ?
            )
            AND r.estado = 'Aprobado'
            `;
        const likeKeyword = `%${keyword}%`;
        const [rows] = await this.dbService.getPool().query(sql, [likeKeyword, likeKeyword, likeKeyword, likeKeyword]);
        const reports = rows;
        return this.enrichReportsList(reports);
    }
};
exports.ReportRepository = ReportRepository;
exports.ReportRepository = ReportRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], ReportRepository);
//# sourceMappingURL=report.repository.js.map