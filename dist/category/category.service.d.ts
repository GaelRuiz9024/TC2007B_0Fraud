import { CategoryRepository, Category } from "./category.repository";
export type CreateCategoryDto = {
    nombre: string;
    descripcion?: string;
    activa?: 0 | 1;
};
export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
}
export declare class CategoryService {
    private readonly categoryRepo;
    constructor(categoryRepo: CategoryRepository);
    createCategory(categoryDto: CreateCategoryDto): Promise<void>;
    findAllCategories(): Promise<Category[]>;
    updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category>;
    deleteCategory(id: number): Promise<void>;
    findCategories(): Promise<Category[]>;
}
