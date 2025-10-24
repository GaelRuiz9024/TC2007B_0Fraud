import { ReportService } from './report.service';
import { Report } from './report.repository';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request';
import type { Request } from 'express';
export declare class CreateReportDto {
    titulo: string;
    descripcion: string;
    urlPagina: string;
    idCategoria?: number;
}
export declare class UpdateReportStatusDto {
    estado: string;
}
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    createReport(req: AuthenticatedRequest, reportDto: CreateReportDto): Promise<void>;
    getMyReports(req: AuthenticatedRequest): Promise<any>;
    uploadImage(reportId: string, file: Express.Multer.File, req: Request): Promise<{
        message: string;
        imageUrl: string;
    }>;
    getAllReports(): Promise<Report[]>;
    updateReportStatus(req: AuthenticatedRequest, updateStatusDto: UpdateReportStatusDto, id: string): Promise<void>;
    searchReports(query: string): Promise<Report[]>;
}
export declare class ReportDetailDto {
    id: number;
    titulo: string;
    autorNombre: string;
    categoriaNombre: string;
    descripcion: string;
    url: string;
    imagenes: string[];
}
