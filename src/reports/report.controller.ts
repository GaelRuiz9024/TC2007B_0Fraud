import { Body, Controller, Get, Post, Put, Req, UseGuards, Query } from '@nestjs/common';
import { ReportService } from './report.service';
import { Report } from './report.repository';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiProperty } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import type { AuthenticatedRequest } from 'src/common/interfaces/authenticated-request';
import { IsNotEmpty, IsString, IsIn, IsUrl, IsOptional, IsNumber } from 'class-validator';


export class CreateReportDto {
  @ApiProperty({ example: 'Phishing en sitio web', description: 'Título del reporte' })
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @ApiProperty({ example: 'El sitio web solicita datos personales', description: 'Descripción' })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({ example: 'https://sitio-sospechoso.com', description: 'URL' })
  @IsNotEmpty()
  @IsUrl()
  urlPagina: string;

  @ApiProperty({ example: 1, description: 'ID de la categoría', required: false })
  @IsOptional()
  @IsNumber()
  idCategoria?: number;
}

export class UpdateReportStatusDto {
  @ApiProperty({ example: 'Aprobado', enum: ['Pendiente', 'Aprobado', 'Rechazado'] })
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
  async createReport(@Req() req: AuthenticatedRequest, @Body() reportDto: CreateReportDto): Promise<void> {
    const userId = Number(req.user.id);
    await this.reportService.createReport(userId, reportDto);
  }

  @Get('my-reports')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async getMyReports(@Req() req: AuthenticatedRequest): Promise<any> {
    const userId = Number(req.user.id);
    return this.reportService.getReportsByUserId(userId);
  }

  @Get('admin/all-reports')
  @UseGuards(IsAdminGuard)
  @ApiBearerAuth()
  async getAllReports(): Promise<Report[]> {
    return this.reportService.getAllReports();
  }

  @Put('admin/update-status/:id')
  @UseGuards(IsAdminGuard)
  @ApiBearerAuth()
  async updateReportStatus(
    @Req() req: AuthenticatedRequest,
    @Body() updateStatusDto: UpdateReportStatusDto,
    @Query('id') id: string
  ): Promise<void> {
    const adminId = Number(req.user.id);
    const reportId = Number(id);
    await this.reportService.updateReportStatus(reportId, updateStatusDto.estado, adminId);
  }

  //Endpoint  
  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async searchReports(@Query('q') query: string): Promise<Report[]> {
    console.log("SI FUNCIONA")
    if (!query) return [];
    const reports = await this.reportService.searchReports(query); 
    return reports;
  }


}

//Dto detalle
export class ReportDetailDto {
  id: number;
  titulo: string;
  autorNombre: string;
  categoriaNombre: string;
  descripcion: string;
  url: string;
  imagenes: string[];
}
