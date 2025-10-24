// src/tips/tips.service.ts
import { Injectable, NotFoundException } from "@nestjs/common";
import {  TipsRepository } from "./tips.repository";

@Injectable()
export class TipsService {
    constructor(private readonly tipsRepository: TipsRepository) {}

    private calculateDayOfYear(date: Date): number {
        const start = new Date(date.getFullYear(), 0, 0);
        const diff = date.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        return Math.floor(diff / oneDay);
    }

    /**
     * Obtiene el tip de ciberseguridad para el día actual, calculado internamente.
     * @returns El tip del día (titulo y contenido).
     */
    async getTipOfTheDay(): Promise<{ titulo: string, contenido: string }> {
        const today = new Date();
        const dayOfYear = this.calculateDayOfYear(today);
        
        const tip = await this.tipsRepository.findTipByDay(dayOfYear);

        if (!tip) {
            const defaultTip = await this.tipsRepository.findTipByDay(1); 
            if (defaultTip) return defaultTip;

            throw new NotFoundException('Tip de ciberseguridad no encontrado para hoy.');
        }

        return {
            titulo: tip.titulo,
            contenido: tip.contenido,
        };
    }
}