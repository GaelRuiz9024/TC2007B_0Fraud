

import { Body, Controller, Get, Post, Put, Req, UseGuards, Param, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import {ReportService} from './report.service'
import { Report } from './report.repository';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags, ApiConsumes} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { IsAdminGuard } from 'src/common/guards/is-admin.guard'
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request'
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString,IsUrl } from 'class-validator';
import type { Request } from 'express'; // Importar Request de express


import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config'; // Importar la configuración de Multer
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
    @Post(':reportId/images')
    @UseGuards(JwtAuthGuard) 
    @UseInterceptors(FileInterceptor('image', multerConfig)) // 'image' es el nombre del campo del formulario
    @ApiConsumes('multipart/form-data') // Especifica el tipo de contenido para Swagger
    @ApiProperty({ type: 'string', format: 'binary', description: 'Archivo de imagen (.jpg, .jpeg, .png, .gif)' }) // Para Swagger
    @ApiOperation({ summary: 'Subir una imagen a un reporte existente' })
    @ApiResponse({ status: 201, description: 'Imagen subida y asociada al reporte exitosamente.' })
    @ApiResponse({ status: 400, description: 'Solicitud inválida o archivo no permitido.' })
    @ApiResponse({ status: 404, description: 'Reporte no encontrado.' })
    async uploadImage(
        @Param('reportId') reportId: string,
        @UploadedFile() file: Express.Multer.File,
        @Req() req: Request // Para obtener la URL base del servidor
    ): Promise<{ message: string; imageUrl: string }> {
        
        if (!file) {
        throw new BadRequestException('No se ha proporcionado ningún archivo de imagen.');
        }

        const numericReportId = Number(reportId);
        if (isNaN(numericReportId)) {
            throw new BadRequestException('El ID del reporte debe ser un número válido.');
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/images/${file.filename}`;

        await this.reportService.uploadReportImage(numericReportId, imageUrl);

        return { message: 'Imagen subida exitosamente.', imageUrl };
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