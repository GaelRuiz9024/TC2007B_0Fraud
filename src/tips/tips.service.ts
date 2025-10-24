
import { Injectable, NotFoundException } from "@nestjs/common";
import { TipsRepository } from "./tips.repository";

export interface TipDto {
    titulo: string;
    contenido: string;
}

@Injectable()
export class TipsService {
    constructor(private readonly tipsRepository: TipsRepository) {}

    async getDailyTip(): Promise<TipDto> {
        // Calcular el día del año (1-365)
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);

        // Obtener el tip correspondiente al día
        const tip = await this.tipsRepository.getTipByDayOfYear(dayOfYear);

        if (!tip) {
            throw new NotFoundException(`No se encontró tip para el día ${dayOfYear}`);
        }

        return {
            titulo: tip.titulo,
            contenido: tip.contenido
        };
    }
}
