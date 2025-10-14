import { Injectable } from '@nestjs/common'
import { DbService } from 'src/db/db.service'
import { CreateReportDto } from './report.controller';


export type Report = {
    id: number;
    idUsuario: number;
    titulo: string;
    descripcion: string;
    urlPagina: string;
    fechaCreacion: Date;
    estado: string;
    idAdminAprobador: number | null; 
    fechaRevision: Date | null;
    idCategoria: number | null;
}

@Injectable()
export class ReportRepository {
    constructor(private readonly dbService: DbService) {}
    async createReport(report: CreateReportDto, userId: number): Promise<void> {
        const sql = `INSERT INTO reporte (idUsuario, titulo, descripcion, urlPagina, idCategoria, estado, fechaCreacion) VALUES (?, ?, ?, ?, ?, ?, NOW()) `;
        const params = [userId, report.titulo, report.descripcion, report.urlPagina, report.idCategoria || null, 'Pendiente'];
    await this.dbService.getPool().query(sql, params);
    }
    async findReportsByUserId(userId: number): Promise<Report[]> {
        const sql = `SELECT * FROM reporte WHERE idUsuario = ?`;
        const [rows] = await this.dbService.getPool().query(sql, [userId]);
        return rows as Report[];
    }

    async findAllReports(): Promise<Report[]> {
        const sql = `SELECT * FROM reporte`;
        const [rows] = await this.dbService.getPool().query(sql, []);
        return rows as Report[];
    }

    async updateReportStatus(reportId: number, status: string, adminId: number): Promise<void> {
        const sql = `UPDATE reporte SET estado = ?, idAdminAprobador = ?, fechaRevision = NOW() WHERE id = ?`;
        const params = [status, adminId, reportId];
        await this.dbService.getPool().query(sql, params);
    }
}
