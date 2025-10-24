import { TipsService } from "./tips.service";
export declare class TipsController {
    private readonly tipsService;
    constructor(tipsService: TipsService);
    getDailyTip(): Promise<import("./tips.service").TipDto>;
}
