/* eslint-disable prettier/prettier */

import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TipsService } from "./tips.service";

@ApiTags('Tips')
@Controller('tips')
export class TipsController {
    constructor(private readonly tipsService: TipsService) {}

    @Get('daily')
    @ApiOperation({ summary: 'Obtener el tip del día basado en la fecha actual' })
    @ApiResponse({ status: 200, description: 'Tip del día obtenido exitosamente' })
    @ApiResponse({ status: 404, description: 'No se encontró tip para el día actual' })
    async getDailyTip() {
        return this.tipsService.getDailyTip();
    }
}
