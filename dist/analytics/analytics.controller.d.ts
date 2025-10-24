import { AnalyticsService, StatusPecentage } from './analytics.service';
import { ReportsByCategory, TopReportedSites, HistoricalReportData, ReportsByMonth } from './analytics.repository';
export declare class AnalyticsController {
    private readonly analyticsService;
    constructor(analyticsService: AnalyticsService);
    getReportCategories(): Promise<ReportsByCategory[]>;
    getHistoricalTrends(): Promise<HistoricalReportData[]>;
    getTopSites(limit?: string): Promise<TopReportedSites[]>;
    getReportStatusPercentage(): Promise<StatusPecentage[]>;
    getReportsByMonth(): Promise<ReportsByMonth[]>;
}
