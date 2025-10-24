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
    imagenes: string[];

}

export type ReportDetail = {
  id: number;
  titulo: string;
  autorNombre: string;
  autorApellido: string;
  categoriaNombre: string;
  descripcion: string;
  url: string;
  imagenes: string[];
};

type ReportImage = {
    urlImagen: string;
}

export type ReportDetail = {
  id: number;
  titulo: string;
  autorNombre: string;
  autorApellido: string;
  categoriaNombre: string;
  descripcion: string;
  url: string;
  imagenes: string[];
};

@Injectable()
export class ReportRepository {
    constructor(private readonly dbService: DbService) {}
    private async getImagesForReport(reportId: number): Promise<string[]> {
        const sql = `SELECT urlImagen FROM imagen_reporte WHERE idReporte = ? ORDER BY fechaSubida ASC`;
        const [rows] = await this.dbService.getPool().query(sql, [reportId]);
        const images = rows as ReportImage[];
        return images.map(img => img.urlImagen);
    }

    private async enrichReportWithImages(report: any): Promise<Report> {
        const images = await this.getImagesForReport(report.id);
        return {
            ...report,
            imagenes: images,
        } as Report;
    }
    
    private async enrichReportsList(reports: any[]): Promise<Report[]> {
        const enrichedReportsPromises = reports.map(report => this.enrichReportWithImages(report));
        return Promise.all(enrichedReportsPromises);
    }

    async addImageToReport(reportId: number, imageUrl: string): Promise<void> {
        const sql = `INSERT INTO imagen_reporte (idReporte, urlImagen, fechaSubida) VALUES (?, ?, NOW())`;
        const params = [reportId, imageUrl];
        await this.dbService.getPool().query(sql, params);
    }
    
    async createReport(report: CreateReportDto, userId: number): Promise<void> {
        const sql = `INSERT INTO reporte (idUsuario, titulo, descripcion, urlPagina, idCategoria, estado, fechaCreacion) VALUES (?, ?, ?, ?, ?, ?, NOW()) `;
        const params = [userId, report.titulo, report.descripcion, report.urlPagina, report.idCategoria || null, 'Pendiente'];
    await this.dbService.getPool().query(sql, params);
    }
    async findReportsByUserId(userId: number): Promise<Report[]> {
        const sql = `SELECT * FROM reporte WHERE idUsuario = ?`;
        const [rows] = await this.dbService.getPool().query(sql, [userId]);
        const reports = rows as any[]; 

        return this.enrichReportsList(reports);
    }

    async findAllReports(): Promise<Report[]> {
        const sql = `SELECT * FROM reporte`;
        const [rows] = await this.dbService.getPool().query(sql, []);
        const reports = rows as any[];
        return this.enrichReportsList(reports);
    }

    async updateReportStatus(reportId: number, status: string, adminId: number): Promise<void> {
        const sql = `UPDATE reporte SET estado = ?, idAdminAprobador = ?, fechaRevision = NOW() WHERE id = ?`;
        const params = [status, adminId, reportId];
        await this.dbService.getPool().query(sql, params);
    }

    async searchReportsByKeyword(keyword: string): Promise<Report[]> {
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
                const reports = rows as any[];
                return this.enrichReportsList(reports);
        }
}
