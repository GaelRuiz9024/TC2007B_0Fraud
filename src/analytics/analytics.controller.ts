/* eslint-disable prettier/prettier */

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AnalyticsService, StatusPecentage } from './analytics.service';
import { ReportsByCategory, TopReportedSites, HistoricalReportData } from './analytics.repository'; 

@ApiTags('Admin - Analíticas y Estadísticas')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get('reports-by-category')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener el conteo de reportes agrupados por categoría.' })
    @ApiResponse({ status: 200, description: 'Datos de conteo de reportes por categoría.', type: [Object] })
    async getReportCategories(): Promise<ReportsByCategory[]> {
        return this.analyticsService.getReportsByCategory();
    }

    @Get('historical-trends')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener datos de reportes por categoría a lo largo del tiempo (Últimos 7 días).' })
    @ApiResponse({ status: 200, description: 'Datos históricos de reportes.', type: [Object] })
    async getHistoricalTrends(): Promise<HistoricalReportData[]> {
        return this.analyticsService.getHistoricalReportTrends();
    }

    @Get('top-sites')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener el Top N de sitios web más reportados.' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de resultados a mostrar (defecto: 5)' })
    @ApiResponse({ status: 200, description: 'Lista de sitios más reportados.', type: [Object] })
    async getTopSites(@Query('limit') limit?: string): Promise<TopReportedSites[]> {
        const limitNumber = limit ? parseInt(limit, 10) : 5;
        return this.analyticsService.getTopReportedSites(limitNumber);
    }

    @Get('status-percentage')
    @UseGuards(IsAdminGuard)
    @ApiOperation({ summary: 'Obtener el porcentaje de reportes por estado (Aprobado, Rechazado, etc.).' })
    @ApiResponse({ status: 200, description: 'Porcentaje de reportes por estado.', type: [Object] })
    async getReportStatusPercentage(): Promise<StatusPecentage[]> {
        return this.analyticsService.getReportStatusPercentages();
    }
}