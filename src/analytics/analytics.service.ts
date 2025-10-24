import { Injectable } from "@nestjs/common";
import { AnalyticsRepository, ReportsByCategory, ReportStatusCount, TopReportedSites, HistoricalReportData, ReportsByMonth } from "./analytics.repository"; // 👈 Importar HistoricalReportData

export type StatusPecentage= {
    status: string;
    percentage: number;
    count: number;
}

@Injectable()
export class AnalyticsService{
    constructor(private readonly analyticsRepository: AnalyticsRepository){}

    async getReportsByCategory(): Promise<ReportsByCategory[]> {
        return this.analyticsRepository.getReportsByCategory();
    }

    async getHistoricalReportTrends(): Promise<HistoricalReportData[]> {
        return this.analyticsRepository.getHistoricalReportTrends();
    }

    async getTopReportedSites(limit: number = 5): Promise<TopReportedSites[]> {
        return this.analyticsRepository.getTopReportedSites(limit);
    }

    async getReportStatusPercentages(): Promise<StatusPecentage[]> {
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

    async getReportsByMonth(): Promise<ReportsByMonth[]> {
    return this.analyticsRepository.getReportsByMonth();
}

}
