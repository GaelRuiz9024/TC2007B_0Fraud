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
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const report_repository_1 = require("./report.repository");
const db_service_1 = require("../db/db.service");
let ReportService = class ReportService {
    reportRepository;
    dbService;
    constructor(reportRepository, dbService) {
        this.reportRepository = reportRepository;
        this.dbService = dbService;
    }
    async createReport(userId, reportDto) {
        await this.reportRepository.createReport(reportDto, userId);
    }
    async getReportsByUserId(userId) {
        return this.reportRepository.findReportsByUserId(userId);
    }
    async getAllReports() {
        return this.reportRepository.findAllReports();
    }
    async updateReportStatus(reportId, status, adminId) {
        await this.reportRepository.updateReportStatus(reportId, status, adminId);
    }
    async uploadReportImage(reportId, imageUrl) {
        const reportExists = await this.dbService.getPool().query('SELECT id FROM reporte WHERE id = ?', [reportId]);
        if (Array.isArray(reportExists[0]) && reportExists[0].length === 0) {
            throw new common_1.NotFoundException(`Reporte con ID ${reportId} no encontrado para añadir la imagen.`);
        }
        await this.reportRepository.addImageToReport(reportId, imageUrl);
    }
    async mapReportToDto(report) {
        const autorCompleto = report.autorNombre
            ? `${report.autorNombre} ${report.autorApellido ?? ''}`.trim()
            : 'Anónimo';
        return {
            id: report.id,
            titulo: report.titulo,
            autorNombre: autorCompleto,
            categoriaNombre: report.categoriaNombre ?? 'Sin categoría',
            descripcion: report.descripcion,
            url: report.url,
            imagenes: report.imagenes || [],
        };
    }
    async searchReports(keyword) {
        return this.reportRepository.searchReportsByKeyword(keyword);
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [report_repository_1.ReportRepository,
        db_service_1.DbService])
], ReportService);
//# sourceMappingURL=report.service.js.map