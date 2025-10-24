import { Category } from './category.repository';
import { CategoryService } from './category.service';
export declare class CreateCategoryBody {
    nombre: string;
    descripcion: string;
    activa: 0 | 1;
}
export declare class UpdateCategoryBody {
    nombre?: string;
    descripcion?: string;
    activa?: 0 | 1;
}
export declare class CategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    create(createDto: CreateCategoryBody): Promise<void>;
    findAll(): Promise<Category[]>;
    update(id: string, updateDto: UpdateCategoryBody): Promise<Category>;
    delete(id: string): Promise<void>;
}
export declare class UsersCategoryController {
    private readonly categoryService;
    constructor(categoryService: CategoryService);
    findCategories(): Promise<Category[]>;
}
