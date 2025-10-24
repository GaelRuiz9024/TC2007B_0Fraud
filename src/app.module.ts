
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbModule } from './db/db.module';

import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';

import { AdminModule } from './admin/admin.module';
import { ReportModule } from './reports/report.module';
import { CategoryModule } from './category/category.module';
import { AnalyticsModule } from './analytics/analytics.module'; 
import { FilesModule } from './files/files.module'; 
import { TipsModule } from './tips/tips.module';

@Module({
  imports: [JwtModule.register({
      global: true,
      secret:process.env.JWT_SECRET || 'supersecret',
  }), 
  DbModule, UserModule, AuthModule, AdminModule,ReportModule,CategoryModule, AnalyticsModule,FilesModule,TipsModule], 
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
