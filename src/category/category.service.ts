import {Injectable, NotFoundException} from "@nestjs/common";
import {CategoryRepository, Category} from "./category.repository";

export type CreateCategoryDto= {
    nombre: string;
    descripcion?: string;
    activa?: 0|1;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto>{}

@Injectable()
export class CategoryService{
    constructor(private readonly categoryRepo: CategoryRepository){}    

    async createCategory(categoryDto: CreateCategoryDto): Promise<void>{
        await this.categoryRepo.createCategory(categoryDto.nombre, categoryDto.descripcion, categoryDto.activa);
    }

    async findAllCategories(): Promise<Category[]> {
        return this.categoryRepo.findAllCategories();
    }

    async updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category> {
        const updatedCategory = await this.categoryRepo.updateCategory(id, dto as Partial<Category>);
        if (!updatedCategory) {
            throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        return updatedCategory;
    }

    async deleteCategory(id: number): Promise<void> {
        const category = await this.categoryRepo.findById(id);
        if (!category) {
            throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        await this.categoryRepo.deleteCategory(id);
    }


}   
