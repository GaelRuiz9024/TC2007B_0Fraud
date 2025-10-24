import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { TipsService } from './tips.service';

@ApiTags('Tips de Ciberseguridad')
@Controller('tips')
export class TipsController {
    constructor(private readonly tipsService: TipsService) {}

    @Get('daily')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Obtener el tip de ciberseguridad correspondiente al día actual (calculado internamente)' })
    @ApiResponse({ 
        status: 200, 
        description: 'Tip del día obtenido exitosamente.',
        schema: {
            example: {
                titulo: 'Contraseñas Fuertes',
                contenido: 'Usa combinaciones de mayúsculas, minúsculas, números y símbolos. Evita datos personales.'
            }
        }
    })
    async getDailyTip(): Promise<{ titulo: string, contenido: string }> {
        return this.tipsService.getTipOfTheDay();
    }
}