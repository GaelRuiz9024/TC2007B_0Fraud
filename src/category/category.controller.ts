
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard'
import { IsAdminGuard } from 'src/common/guards/is-admin.guard';
import { Category } from './category.repository';
import { CategoryService } from './category.service';

// DTOs para Swagger y Validación
export class CreateCategoryBody {
  @ApiProperty({ example: 'Phishing', description: 'Nombre de la nueva categoría' })
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'Sitios que intentan robar credenciales', description: 'Descripción de la categoría' })
  @IsNotEmpty()
  @IsString()
  descripcion: string;

  @ApiProperty({ example: 1, description: 'Estado de la categoría (0: Inactiva, 1: Activa)', required: false, enum: [0, 1] })
  @IsOptional()
  @IsIn([0, 1])
  activa: 0 | 1 = 1;
}

export class UpdateCategoryBody {
    @ApiProperty({ example: 'Phishing 2.0', description: 'Nuevo nombre de la categoría', required: false })
    @IsOptional()
    @IsString()
    nombre?: string;
  
    @ApiProperty({ example: 'Nueva descripción detallada', description: 'Nueva descripción de la categoría', required: false })
    @IsOptional()
    @IsString()
    descripcion?: string;
  
    @ApiProperty({ example: 0, description: 'Nuevo estado de la categoría (0: Inactiva, 1: Activa)', required: false, enum: [0, 1] })
    @IsOptional()
    @IsIn([0, 1])
    activa?: 0 | 1;
}

@ApiTags('Admin - Gestión de Categorías')
@ApiBearerAuth()
@UseGuards(IsAdminGuard)
@Controller('admin/categories')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Post()
    @ApiOperation({ summary: 'Crear una nueva categoría' })
    @ApiResponse({ status: 201, description: 'Categoría creada exitosamente.' })
    @ApiResponse({ status: 401, description: 'No autorizado / Token inválido.' })
    @ApiResponse({ status: 403, description: 'Prohibido. Se requiere rol de administrador.' })
    async create(@Body() createDto: CreateCategoryBody): Promise<void> {
        await this.categoryService.createCategory(createDto);
    }

    @Get()
    @ApiOperation({ summary: 'Obtener todas las categorías' })
    @ApiResponse({ status: 200, description: 'Lista de categorías obtenida.' })
    async findAll(): Promise<Category[]> {
        return this.categoryService.findAllCategories();
    }

    @Put(':id')
    @ApiOperation({ summary: 'Actualizar una categoría existente' })
    @ApiResponse({ status: 200, description: 'Categoría actualizada exitosamente.' })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
    async update(@Param('id') id: string, @Body() updateDto: UpdateCategoryBody): Promise<Category> {
        const categoryId = Number(id);
        return this.categoryService.updateCategory(categoryId, updateDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Eliminar una categoría' })
    @ApiResponse({ status: 200, description: 'Categoría eliminada exitosamente.' })
    @ApiResponse({ status: 404, description: 'Categoría no encontrada.' })
    async delete(@Param('id') id: string): Promise<void> {
        const categoryId = Number(id);
        await this.categoryService.deleteCategory(categoryId);
    }
}




@ApiTags('Categorías')
@Controller('categories')

export class UsersCategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Obtener todas las categorías' })
  @ApiResponse({ status: 200, description: 'Lista de categorías' })
  async findCategories(): Promise<Category[]> {
    const all = await this.categoryService.findCategories();
    return all.filter(c => c.activa === 1);
  }
}