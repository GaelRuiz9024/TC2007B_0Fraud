/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Report, ReportDetail, ReportRepository } from './report.repository';
import { CreateReportDto, ReportDetailDto } from './report.controller';



@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository) {}

  async createReport(userId: number, reportDto: CreateReportDto): Promise<void> {
    await this.reportRepository.createReport(reportDto, userId);
  }

  async getReportsByUserId(userId: number): Promise<Report[]> {
    return this.reportRepository.findReportsByUserId(userId);
  }

  async getAllReports(): Promise<Report[]> {
    return this.reportRepository.findAllReports();
  }

  async updateReportStatus(reportId: number, status: string, adminId: number): Promise<void> {
    await this.reportRepository.updateReportStatus(reportId, status, adminId);
  }

  // endpoints
  async mapReportToDto(report: ReportDetail): Promise<ReportDetailDto> {
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

  async searchReports(keyword: string): Promise<Report[]> {
        return this.reportRepository.searchReportsByKeyword(keyword);
    }
 
}
