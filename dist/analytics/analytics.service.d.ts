import { AnalyticsRepository, ReportsByCategory, TopReportedSites, HistoricalReportData } from "./analytics.repository";
export type StatusPecentage = {
    status: string;
    percentage: number;
    count: number;
};
export declare class AnalyticsService {
    private readonly analyticsRepository;
    constructor(analyticsRepository: AnalyticsRepository);
    getReportsByCategory(): Promise<ReportsByCategory[]>;
    getHistoricalReportTrends(): Promise<HistoricalReportData[]>;
    getTopReportedSites(limit?: number): Promise<TopReportedSites[]>;
    getReportStatusPercentages(): Promise<StatusPecentage[]>;
}
