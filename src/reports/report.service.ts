/* eslint-disable prettier/prettier */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Report, ReportRepository } from './report.repository';
import { CreateReportDto } from './report.controller';

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
    // Aquí puedes agregar validaciones adicionales si lo deseas, como si el reporte existe
    await this.reportRepository.updateReportStatus(reportId, status, adminId);
  }
}