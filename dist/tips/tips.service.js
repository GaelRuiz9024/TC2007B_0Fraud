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
exports.TipsService = void 0;
const common_1 = require("@nestjs/common");
const tips_repository_1 = require("./tips.repository");
let TipsService = class TipsService {
    tipsRepository;
    constructor(tipsRepository) {
        this.tipsRepository = tipsRepository;
    }
    async getDailyTip() {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const diff = now.getTime() - start.getTime();
        const oneDay = 1000 * 60 * 60 * 24;
        const dayOfYear = Math.floor(diff / oneDay);
        const tip = await this.tipsRepository.getTipByDayOfYear(dayOfYear);
        if (!tip) {
            throw new common_1.NotFoundException(`No se encontró tip para el día ${dayOfYear}`);
        }
        return {
            titulo: tip.titulo,
            contenido: tip.contenido
        };
    }
};
exports.TipsService = TipsService;
exports.TipsService = TipsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tips_repository_1.TipsRepository])
], TipsService);
