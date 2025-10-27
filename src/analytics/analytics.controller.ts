
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger';import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AnalyticsService, type StatusPecentage } from './analytics.service';
import type { ReportsByCategory, TopReportedSites, HistoricalReportData, ReportsByMonth } from './analytics.repository'; 

export class ReportsByCategoryDto {
    @ApiProperty({ example: 'Phishing', description: 'Nombre de la categoría' })
    nombre: string;

    @ApiProperty({ example: '12', description: 'Conteo total (devuelto como string por la DB)' })
    total: string;
}

export class HistoricalReportDataDto {
    @ApiProperty({ example: '2025-10-27', description: 'Fecha del reporte' })
    fecha: string;

    @ApiProperty({ example: 'Malware', description: 'Nombre de la categoría' })
    categoria: string;

    @ApiProperty({ example: '3', description: 'Conteo total para ese día (devuelto como string)' })
    total: string;
}

export class TopReportedSitesDto {
    @ApiProperty({ example: 'https://sitio-falso.com', description: 'URL del sitio reportado' })
    urlPagina: string;

    @ApiProperty({ example: '45', description: 'Conteo total de reportes para esa URL (devuelto como string)' })
    total: string;
}

export class ReportsByMonthDto {
    @ApiProperty({ example: 'Octubre', description: 'Nombre del mes' })
    mes: string;

    @ApiProperty({ example: '150', description: 'Conteo total para ese mes (devuelto como string)' })
    total: string;
}

export class StatusPecentageDto {
    @ApiProperty({ example: 'Aprobado', description: 'Estado del reporte' })
    estado: string;

    @ApiProperty({ example: 50, description: 'Conteo total para ese estado' })
    total: number;

    @ApiProperty({ example: 0.5, description: 'Porcentaje (0.0 a 1.0)' })
    porcentaje: number;
}

@ApiTags('Admin - Analíticas y Estadísticas')
@ApiBearerAuth()
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) {}

    @Get('reports-by-category')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener el conteo de reportes agrupados por categoría.' })
    @ApiResponse({ status: 200, description: 'Datos de conteo de reportes por categoría.', type: [ReportsByCategoryDto] })
    @ApiResponse({ status: 401, description: 'No autorizado' }) 
    async getReportCategories(): Promise<ReportsByCategory[]> {
        return this.analyticsService.getReportsByCategory();
    }

    @Get('historical-trends')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener datos de reportes por categoría a lo largo del tiempo (Últimos 7 días).' })
    @ApiResponse({ status: 200, description: 'Datos históricos de reportes.', type: [HistoricalReportDataDto] })
    @ApiResponse({ status: 401, description: 'No autorizado' }) 
    async getHistoricalTrends(): Promise<HistoricalReportData[]> {
        return this.analyticsService.getHistoricalReportTrends();
    }

    @Get('top-sites')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener el Top N de sitios web más reportados.' })
    @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Número de resultados a mostrar (defecto: 5)' })
    @ApiResponse({ status: 200, description: 'Lista de sitios más reportados.', type: [TopReportedSitesDto] })
    @ApiResponse({ status: 401, description: 'No autorizado' }) 
    async getTopSites(@Query('limit') limit?: string): Promise<TopReportedSites[]> {
        const limitNumber = limit ? parseInt(limit, 10) : 5;
        return this.analyticsService.getTopReportedSites(limitNumber);
    }

    @Get('status-percentage')
    @UseGuards(IsAdminGuard)
    @ApiOperation({ summary: 'Obtener el porcentaje de reportes por estado (Aprobado, Rechazado, etc.).' })
    @ApiResponse({ status: 200, description: 'Porcentaje de reportes por estado.', type: [StatusPecentageDto] })
    @ApiResponse({ status: 401, description: 'No autorizado' }) 
    @ApiResponse({ status: 403, description: 'Prohibido (No es admin)' }) 
    async getReportStatusPercentage(): Promise<StatusPecentage[]> {
        return this.analyticsService.getReportStatusPercentages();
    }

    @Get('reports-by-month')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({ summary: 'Obtener la cantidad de reportes por mes.' })
    @ApiResponse({ status: 200, description: 'Cantidad de reportes por mes.', type: [ReportsByMonthDto] })
    @ApiResponse({ status: 401, description: 'No autorizado' })
    async getReportsByMonth(): Promise<ReportsByMonth[]> {
        return this.analyticsService.getReportsByMonth();
    }
}