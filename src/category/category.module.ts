
import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategoryRepository } from './category.repository';
import { AuthModule } from 'src/auth/auth.module'; // Necesario para IsAdminGuard

@Module({
  imports: [AuthModule],
  controllers: [CategoryController,UsersCategoryController],
  providers: [CategoryService, CategoryRepository],
  exports: [CategoryService, CategoryRepository]
})
export class CategoryModule {}