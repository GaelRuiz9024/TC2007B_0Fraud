import { TipsRepository } from "./tips.repository";
export interface TipDto {
    titulo: string;
    contenido: string;
}
export declare class TipsService {
    private readonly tipsRepository;
    constructor(tipsRepository: TipsRepository);
    getDailyTip(): Promise<TipDto>;
}
