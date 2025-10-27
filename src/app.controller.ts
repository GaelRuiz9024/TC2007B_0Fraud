import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Status') 
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Endpoint de Health Check / Status' }) 
  @ApiResponse({ status: 200, description: 'API funcionando correctamente.', type: String }) 
  getHello(): string {
    return this.appService.getHello();
  }
}
