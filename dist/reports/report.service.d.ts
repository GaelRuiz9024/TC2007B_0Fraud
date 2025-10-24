import { Report, ReportDetail, ReportRepository } from './report.repository';
import { CreateReportDto, ReportDetailDto } from './report.controller';
import { DbService } from 'src/db/db.service';
export declare class ReportService {
    private readonly reportRepository;
    private readonly dbService;
    constructor(reportRepository: ReportRepository, dbService: DbService);
    createReport(userId: number, reportDto: CreateReportDto): Promise<void>;
    getReportsByUserId(userId: number): Promise<Report[]>;
    getAllReports(): Promise<Report[]>;
    updateReportStatus(reportId: number, status: string, adminId: number): Promise<void>;
    uploadReportImage(reportId: number, imageUrl: string): Promise<void>;
    mapReportToDto(report: ReportDetail): Promise<ReportDetailDto>;
    searchReports(keyword: string): Promise<Report[]>;
}
