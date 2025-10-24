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
    idAdminAprobador: number | null;
    fechaRevision: Date | null;
    idCategoria: number | null;
    imagenes: string[];
};
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
export declare class ReportRepository {
    private readonly dbService;
    constructor(dbService: DbService);
    private getImagesForReport;
    private enrichReportWithImages;
    private enrichReportsList;
    addImageToReport(reportId: number, imageUrl: string): Promise<void>;
    createReport(report: CreateReportDto, userId: number): Promise<void>;
    findReportsByUserId(userId: number): Promise<Report[]>;
    findAllReports(): Promise<Report[]>;
    updateReportStatus(reportId: number, status: string, adminId: number): Promise<void>;
    searchReportsByKeyword(keyword: string): Promise<Report[]>;
}
