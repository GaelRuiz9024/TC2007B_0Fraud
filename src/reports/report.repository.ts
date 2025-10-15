import { Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateReportDto } from './report.controller';

export type Report = {
    id: number;
    idUsuario: number;
    titulo: string;
    descripcion: string;
    urlPagina: string;
    fechaCreacion: Date;
    estado: string;
    idAdmin: number | null;
    fechaRevision: Date | null;
    idCategoria: number | null;
};

//Detalle
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

    async createReport(report: CreateReportDto, userId: number): Promise<void> {
        const sql = `
          INSERT INTO reporte 
          (idUsuario, titulo, descripcion, urlPagina, idCategoria, estado, fechaCreacion)
          VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
        const params = [
            userId,
            report.titulo,
            report.descripcion,
            report.urlPagina,
            report.idCategoria || null,
            'Pendiente'
        ];
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
        const sql = `UPDATE reporte SET estado = ?, idAdmin = ?, fechaRevision = NOW() WHERE id = ?`;
        await this.dbService.getPool().query(sql, [status, adminId, reportId]);
    }

    //Endpoint 
    async searchReportsByKeyword(keyword: string): Promise<Report[]> {
        const sql = `
            SELECT 
                r.*, 
                c.nombre AS categoriaNombre,
                u.nombre AS autorNombre
            FROM reporte r
            LEFT JOIN categoria c ON r.idCategoria = c.id
            LEFT JOIN usuario u ON r.idUsuario = u.id
            WHERE (r.titulo LIKE ? 
                OR r.descripcion LIKE ?
                OR r.urlPagina LIKE ?
                OR c.nombre LIKE ?)
            AND r.estado = 'Aprobado'
        `;

        const likeKeyword = `%${keyword}%`;
        const [rows] = await this.dbService.getPool().query(sql, [likeKeyword, likeKeyword, likeKeyword, likeKeyword]);
        return rows as Report[];
}


    //Por estado 
    async countReportsByUser(userId: number): Promise<{ aprobado: number; pendiente: number; rechazado: number }> {
    const sql = `
        SELECT estado, COUNT(*) as total
        FROM reporte
        WHERE idUsuario = ?
        GROUP BY estado
    `;
    const [rows] = await this.dbService.getPool().query(sql, [userId]);

    const counts = { aprobado: 0, pendiente: 0, rechazado: 0 };

    for (const row of rows as any[]) {
        const estado = row.estado.toLowerCase();
        if (estado === 'aprobado') counts.aprobado = row.total;
        if (estado === 'pendiente') counts.pendiente = row.total;
        if (estado === 'rechazado') counts.rechazado = row.total;
    }

    return counts;
}

}
