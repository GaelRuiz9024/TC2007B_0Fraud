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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const analytics_repository_1 = require("./analytics.repository");
let AnalyticsService = class AnalyticsService {
    analyticsRepository;
    constructor(analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }
    async getReportsByCategory() {
        return this.analyticsRepository.getReportsByCategory();
    }
    async getHistoricalReportTrends() {
        return this.analyticsRepository.getHistoricalReportTrends();
    }
    async getTopReportedSites(limit = 5) {
        return this.analyticsRepository.getTopReportedSites(limit);
    }
    async getReportStatusPercentages() {
        const counts = await this.analyticsRepository.getReportStatusCounts();
        const totalReports = counts.reduce((sum, item) => sum + item.count, 0);
        if (totalReports === 0) {
            return [];
        }
        return counts.map(item => ({
            status: item.estado,
            count: item.count,
            percentage: parseFloat(((item.count / totalReports) * 100).toFixed(2)),
        }));
    }
    async getReportsByMonth() {
        return this.analyticsRepository.getReportsByMonth();
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [analytics_repository_1.AnalyticsRepository])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map