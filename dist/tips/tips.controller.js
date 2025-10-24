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
exports.TipsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tips_service_1 = require("./tips.service");
let TipsController = class TipsController {
    tipsService;
    constructor(tipsService) {
        this.tipsService = tipsService;
    }
    async getDailyTip() {
        return this.tipsService.getDailyTip();
    }
};
exports.TipsController = TipsController;
__decorate([
    (0, common_1.Get)('daily'),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener el tip del día basado en la fecha actual' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tip del día obtenido exitosamente' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontró tip para el día actual' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TipsController.prototype, "getDailyTip", null);
exports.TipsController = TipsController = __decorate([
    (0, swagger_1.ApiTags)('Tips'),
    (0, common_1.Controller)('tips'),
    __metadata("design:paramtypes", [tips_service_1.TipsService])
], TipsController);
