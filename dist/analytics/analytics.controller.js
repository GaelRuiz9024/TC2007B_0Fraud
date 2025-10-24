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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const is_admin_guard_1 = require("../common/guards/is-admin.guard");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const analytics_service_1 = require("./analytics.service");
let AnalyticsController = class AnalyticsController {
    analyticsService;
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getReportCategories() {
        return this.analyticsService.getReportsByCategory();
    }
    async getHistoricalTrends() {
        return this.analyticsService.getHistoricalReportTrends();
    }
    async getTopSites(limit) {
        const limitNumber = limit ? parseInt(limit, 10) : 5;
        return this.analyticsService.getTopReportedSites(limitNumber);
    }
    async getReportStatusPercentage() {
        return this.analyticsService.getReportStatusPercentages();
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('reports-by-category'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el conteo de reportes agrupados por categoría.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Datos de conteo de reportes por categoría.', type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReportCategories", null);
__decorate([
    (0, common_1.Get)('historical-trends'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener datos de reportes por categoría a lo largo del tiempo (Últimos 7 días).' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Datos históricos de reportes.', type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getHistoricalTrends", null);
__decorate([
    (0, common_1.Get)('top-sites'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el Top N de sitios web más reportados.' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number, description: 'Número de resultados a mostrar (defecto: 5)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de sitios más reportados.', type: [Object] }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTopSites", null);
__decorate([
    (0, common_1.Get)('status-percentage'),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el porcentaje de reportes por estado (Aprobado, Rechazado, etc.).' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Porcentaje de reportes por estado.', type: [Object] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getReportStatusPercentage", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Analíticas y Estadísticas'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map