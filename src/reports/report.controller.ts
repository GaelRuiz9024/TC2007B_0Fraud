
import { Body, Controller, Get, Post, Put, Req, UseGuards, Param, UploadedFile, UseInterceptors, BadRequestException, Query } from '@nestjs/common';
import {ReportService} from './report.service'
import type { Report } from './report.repository';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags, ApiConsumes, ApiBody, ApiParam, ApiQuery} from '@nestjs/swagger';import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { IsAdminGuard } from 'src/common/guards/is-admin.guard'
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request'
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString,IsUrl } from 'class-validator';
import type { Request } from 'express'; 
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';


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

export class ReportDetailDto {
  @ApiProperty()
  id: number;
  
  @ApiProperty()
  titulo: string;
  
  @ApiProperty()
  autorNombre: string;
  
  @ApiProperty()
  categoriaNombre: string;
  
  @ApiProperty()
  descripcion: string;
  
  @ApiProperty({ example: "https://sitio-malicioso.com" })
  url: string;
  
  @ApiProperty({ type: [String], example: ["http://localhost:4000/uploads/images/imagen.png"] })
  imagenes: string[];
}

@ApiTags('Reports')
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear un nuevo reporte' }) 
  @ApiResponse({ status: 201, description: 'Reporte creado exitosamente' }) 
  @ApiResponse({ status: 401, description: 'No autorizado' }) 
  @ApiResponse({ status: 400, description: 'Datos inválidos' }) 
  async createReport(@Req() req: AuthenticatedRequest, @Body() reportDto: CreateReportDto): Promise<void> {
    const userId = Number(req.user.id);
    await this.reportService.createReport(userId, reportDto);
  }

  @Get('my-reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener los reportes creados por el usuario autenticado' }) 
  @ApiResponse({ status: 200, description: 'Lista de mis reportes', type: [ReportDetailDto] }) 
  @ApiResponse({ status: 401, description: 'No autorizado' }) 
  async getMyReports(@Req() req: AuthenticatedRequest): Promise<any> {
    const userId = Number(req.user.id);
    return this.reportService.getReportsByUserId(userId);
  }
  
  @Post(':reportId/images')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() 
  @UseInterceptors(FileInterceptor('image', multerConfig)) 
  @ApiConsumes('multipart/form-data') 
  @ApiOperation({ summary: 'Subir una imagen a un reporte existente' })
  @ApiParam({ name: 'reportId', description: 'ID del reporte al que se añade la imagen', type: Number }) 
  @ApiBody({
    description: 'Archivo de imagen (.jpg, .jpeg, .png, .gif)',
    schema: {
      type: 'object',
      properties: {
        image: { 
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Imagen subida y asociada al reporte exitosamente.' })
  @ApiResponse({ status: 400, description: 'Solicitud inválida o archivo no permitido.' })
  @ApiResponse({ status: 401, description: 'No autorizado' }) 
  @ApiResponse({ status: 404, description: 'Reporte no encontrado.' })
  async uploadImage(
      @Param('reportId') reportId: string,
      @UploadedFile() file: Express.Multer.File,
      @Req() req: Request 
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
  @ApiOperation({ summary: 'Obtener todos los reportes (Admin)' }) 
  @ApiResponse({ status: 200, description: 'Lista de todos los reportes', type: [ReportDetailDto] }) 
  @ApiResponse({ status: 401, description: 'No autorizado' }) 
  @ApiResponse({ status: 403, description: 'Prohibido (No es admin)' }) 
  async getAllReports(): Promise<Report[]> {
    return this.reportService.getAllReports(); 
  }


    @Put('admin/update-status/:id')
    @UseGuards(IsAdminGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Actualizar el estado de un reporte (Admin)' }) 
    @ApiParam({ name: 'id', description: 'ID del reporte a actualizar', type: Number }) 
    @ApiResponse({ status: 200, description: 'Estado actualizado exitosamente.' }) 
    @ApiResponse({ status: 401, description: 'No autorizado' }) 
    @ApiResponse({ status: 403, description: 'Prohibido (No es admin)' }) 
    @ApiResponse({ status: 404, description: 'Reporte no encontrado' })
    async updateReportStatus(
      @Req() req: AuthenticatedRequest,
      @Body() updateStatusDto: UpdateReportStatusDto,
      @Param('id') id: string
    ): Promise<void> {
      const adminId = Number(req.user.id);
      const reportId = Number(id); 
      
      if (isNaN(reportId)) {
        throw new BadRequestException('El ID del reporte debe ser un número válido.');
      }

      await this.reportService.updateReportStatus(reportId, updateStatusDto.estado, adminId);
    }
  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Buscar reportes por término (título o URL)' }) 
  @ApiQuery({ name: 'q', description: 'Término de búsqueda', type: String, required: true }) 
  @ApiResponse({ status: 200, description: 'Resultados de la búsqueda', type: [ReportDetailDto] }) 
  @ApiResponse({ status: 401, description: 'No autorizado' }) 
  async searchReports(@Query('q') query: string): Promise<Report[]> {
    console.log("SI FUNCIONA")
    if (!query) return [];
    const reports = await this.reportService.searchReports(query); 
    return reports;
  }
}


