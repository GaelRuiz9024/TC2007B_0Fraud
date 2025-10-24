"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportDetailDto = exports.ReportController = exports.UpdateReportStatusDto = exports.CreateReportDto = void 0;
const common_1 = require("@nestjs/common");
const report_service_1 = require("./report.service");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const is_admin_guard_1 = require("../common/guards/is-admin.guard");
const class_validator_1 = require("class-validator");
const platform_express_1 = require("@nestjs/platform-express");
const multer_config_1 = require("../config/multer.config");
class CreateReportDto {
    titulo;
    descripcion;
    urlPagina;
    idCategoria;
}
exports.CreateReportDto = CreateReportDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Phishing en sitio web', description: 'Título del reporte' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "titulo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'El sitio web solicita datos personales de forma sospechosa', description: 'Descripción detallada del reporte' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://sitio-sospechoso.com', description: 'URL del sitio web a reportar' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsUrl)(),
    __metadata("design:type", String)
], CreateReportDto.prototype, "urlPagina", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'ID de la categoría del reporte (e.g., 1=Phishing)', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateReportDto.prototype, "idCategoria", void 0);
class UpdateReportStatusDto {
    estado;
}
exports.UpdateReportStatusDto = UpdateReportStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Aprobado', description: 'Nuevo estado del reporte', enum: ['Pendiente', 'Aprobado', 'Rechazado'] }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(['Pendiente', 'Aprobado', 'Rechazado']),
    __metadata("design:type", String)
], UpdateReportStatusDto.prototype, "estado", void 0);
let ReportController = class ReportController {
    reportService;
    constructor(reportService) {
        this.reportService = reportService;
    }
    async createReport(req, reportDto) {
        const userId = Number(req.user.id);
        await this.reportService.createReport(userId, reportDto);
    }
    async getMyReports(req) {
        const userId = Number(req.user.id);
        return this.reportService.getReportsByUserId(userId);
    }
    async uploadImage(reportId, file, req) {
        if (!file) {
            throw new common_1.BadRequestException('No se ha proporcionado ningún archivo de imagen.');
        }
        const numericReportId = Number(reportId);
        if (isNaN(numericReportId)) {
            throw new common_1.BadRequestException('El ID del reporte debe ser un número válido.');
        }
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const imageUrl = `${baseUrl}/uploads/images/${file.filename}`;
        await this.reportService.uploadReportImage(numericReportId, imageUrl);
        return { message: 'Imagen subida exitosamente.', imageUrl };
    }
    async getAllReports() {
        return this.reportService.getAllReports();
    }
    async updateReportStatus(req, updateStatusDto, id) {
        const adminId = Number(req.user.id);
        const reportId = Number(id);
        await this.reportService.updateReportStatus(reportId, updateStatusDto.estado, adminId);
    }
    async searchReports(query) {
        console.log("SI FUNCIONA");
        if (!query)
            return [];
        const reports = await this.reportService.searchReports(query);
        return reports;
    }
};
exports.ReportController = ReportController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateReportDto]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "createReport", null);
__decorate([
    (0, common_1.Get)('my-reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getMyReports", null);
__decorate([
    (0, common_1.Post)(':reportId/images'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', multer_config_1.multerConfig)),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiProperty)({ type: 'string', format: 'binary', description: 'Archivo de imagen (.jpg, .jpeg, .png, .gif)' }),
    (0, swagger_1.ApiOperation)({ summary: 'Subir una imagen a un reporte existente' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Imagen subida y asociada al reporte exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Solicitud inválida o archivo no permitido.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Reporte no encontrado.' }),
    __param(0, (0, common_1.Param)('reportId')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Get)('admin/all-reports'),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "getAllReports", null);
__decorate([
    (0, common_1.Put)('admin/update-status/:id'),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Query)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, UpdateReportStatusDto, String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "updateReportStatus", null);
__decorate([
    (0, common_1.Get)('search'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Query)('q')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReportController.prototype, "searchReports", null);
exports.ReportController = ReportController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, common_1.Controller)('reports'),
    __metadata("design:paramtypes", [report_service_1.ReportService])
], ReportController);
class ReportDetailDto {
    id;
    titulo;
    autorNombre;
    categoriaNombre;
    descripcion;
    url;
    imagenes;
}
exports.ReportDetailDto = ReportDetailDto;
//# sourceMappingURL=report.controller.js.map