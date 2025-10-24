import { Module } from '@nestjs/common';
import { TipsController } from './tips.controller';
import { TipsService } from './tips.service';
import { TipsRepository } from './tips.repository';
import { AuthModule } from 'src/auth/auth.module';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [
    AuthModule, 
    DbModule 
  ],
  controllers: [TipsController],
  providers: [TipsService, TipsRepository],
})
export class TipsModule {}