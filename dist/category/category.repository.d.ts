import { DbService } from "src/db/db.service";
export type Category = {
    id: number;
    nombre: string;
    descripcion: string | null;
    activa: 0 | 1;
};
export declare class CategoryRepository {
    private readonly dbService;
    constructor(dbService: DbService);
    createCategory(nombre: string, descripcion?: string, activa?: 0 | 1): Promise<void>;
    findAllCategories(): Promise<Category[]>;
    updateCategory(id: number, updateData: Partial<Category>): Promise<Category | undefined>;
    deleteCategory(id: number): Promise<void>;
    findById(id: number): Promise<Category>;
}
export declare class UsersCategoryRepository {
    private readonly dbService;
    constructor(dbService: DbService);
    findCategories(): Promise<Category[]>;
}
