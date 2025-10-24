
import { Injectable, NotFoundException } from '@nestjs/common';
import { Report, ReportRepository } from './report.repository';
import { CreateReportDto,ReportDetailDto } from './report.controller';
import { DbService } from 'src/db/db.service';


@Injectable()
export class ReportService {
  constructor(private readonly reportRepository: ReportRepository,
              private readonly dbService: DbService
) {}

  async createReport(userId: number, reportDto: CreateReportDto): Promise<void> {
    console.log(`Creando reporte para el usuario ${userId} con los datos:`, reportDto); // 👈 ¡PELIGRO! Log de datos sensibles.
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
  async uploadReportImage(reportId: number, imageUrl: string): Promise<void> {
    const reportExists = await this.dbService.getPool().query('SELECT id FROM reporte WHERE id = ?', [reportId]);
    if (Array.isArray(reportExists[0]) && reportExists[0].length === 0) {
      throw new NotFoundException(`Reporte con ID ${reportId} no encontrado para añadir la imagen.`);
    }
    await this.reportRepository.addImageToReport(reportId, imageUrl);
  }
  async mapReportToDto(report: ReportDetailDto): Promise<ReportDetailDto> {
    const autorCompleto = report.autorNombre
      ? `${report.autorNombre} ${report.autorApellido ?? ''}`.trim()
      : 'Anónimo';
    
    return {
      id: report.id,
      titulo: report.titulo,
      autorNombre: autorCompleto,
      autorApellido: report.autorApellido,
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