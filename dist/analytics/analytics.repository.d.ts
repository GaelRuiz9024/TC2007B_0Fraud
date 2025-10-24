import { DbService } from "../db/db.service";
export type ReportsByCategory = {
    categoryName: string;
    reportCount: number;
};
export type TopReportedSites = {
    urlPagina: string;
    reportCount: number;
};
export type ReportStatusCount = {
    estado: string;
    count: number;
};
export type HistoricalReportData = {
    date: string;
    categoryName: string;
    reportCount: number;
};
export type ReportsByMonth = {
    month: string;
    reportCount: number;
};
export declare class AnalyticsRepository {
    private readonly dbService;
    constructor(dbService: DbService);
    getHistoricalReportTrends(): Promise<HistoricalReportData[]>;
    getReportsByCategory(): Promise<ReportsByCategory[]>;
    getTopReportedSites(limit?: number): Promise<TopReportedSites[]>;
    getReportStatusCounts(): Promise<ReportStatusCount[]>;
    getReportsByMonth(): Promise<ReportsByMonth[]>;
}
