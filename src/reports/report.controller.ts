/* eslint-disable prettier/prettier */


import {Body, Controller, Get, Param, Post, Put, Req, UseGuards} from '@nestjs/common'
import {ReportService} from './report.service'
import { Report } from './report.repository'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { IsAdminGuard } from 'src/common/guards/is-admin.guard'
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request'
import { IsNotEmpty, IsString,IsIn, IsUrl, IsOptional, IsNumber } from 'class-validator';

export class CreateReportDto {
  @ApiProperty({ example: 'Phishing en sitio web', description: 'Título del reporte' })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({ example: 'El sitio web solicita datos personales de forma sospechosa', description: 'Descripción detallada del reporte' })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({ example: 'https://sitio-sospechoso.com', description: 'URL del sitio web a reportar' })
  @IsNotEmpty()
  @IsUrl()
  urlPagina: string;

  @ApiProperty({ example: 1, description: 'ID de la categoría del reporte (e.g., 1=Phishing)', required: false })
  @IsOptional()
  @IsNumber()
  idCategoria?: number;
}

export class UpdateReportStatusDto {
  @ApiProperty({ example: 'Aprobado', description: 'Nuevo estado del reporte', enum: ['Pendiente', 'Aprobado', 'Rechazado'] })
  @IsNotEmpty()
  @IsString()
  @IsIn(['Pendiente', 'Aprobado', 'Rechazado'])
  estado: string;
}

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
    constructor(private readonly reportService: ReportService) {}
    
    @Post()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Crear un nuevo reporte (para usuarios)' })
    @ApiResponse({ status: 201, description: 'Reporte creado exitosamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    async createReport(@Req() req: AuthenticatedRequest, @Body() reportDto: CreateReportDto) : Promise<void> {
        const userId =Number( req.user.id)
        await this.reportService.createReport(userId, reportDto);
    }

    @Get('my-reports')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener reportes del usuario autenticado' })
    @ApiResponse({ status: 200, description: 'Lista de reportes del usuario.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    async (@Req() req: AuthenticatedRequest) : Promise<any> {
        const userId = Number(req.user.id)
        return this.reportService.getReportsByUserId(userId);
    }

    @Get('admin/all-reports')
    @UseGuards(IsAdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener todos los reportes (para administradores)' })
    @ApiResponse({ status: 200, description: 'Lista de todos los reportes.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 403, description: 'Prohibido. Solo administradores.' })
    async getAllReports() : Promise<Report[]> {
        return this.reportService.getAllReports();
    }

    @Put('admin/update-status/:id')
    @UseGuards(IsAdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar el estado de un reporte (para administradores)' })
    @ApiResponse({ status: 200, description: 'Estado del reporte actualizado.' })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    async updateReportStatus(@Req() req: AuthenticatedRequest, @Param('id') id: string, @Body() updateStatusDto: UpdateReportStatusDto) : Promise<void> {
        const adminId = Number(req.user.id)
        const reportId = Number(id);
        await this.reportService.updateReportStatus(reportId, updateStatusDto.estado, adminId);
    }
}