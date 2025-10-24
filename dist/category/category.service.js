"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryService = void 0;
const common_1 = require("@nestjs/common");
const category_repository_1 = require("./category.repository");
let CategoryService = class CategoryService {
    categoryRepo;
    constructor(categoryRepo) {
        this.categoryRepo = categoryRepo;
    }
    async createCategory(categoryDto) {
        await this.categoryRepo.createCategory(categoryDto.nombre, categoryDto.descripcion, categoryDto.activa);
    }
    async findAllCategories() {
        return this.categoryRepo.findAllCategories();
    }
    async updateCategory(id, dto) {
        const updatedCategory = await this.categoryRepo.updateCategory(id, dto);
        if (!updatedCategory) {
            throw new common_1.NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        return updatedCategory;
    }
    async deleteCategory(id) {
        const category = await this.categoryRepo.findById(id);
        if (!category) {
            throw new common_1.NotFoundException(`Categoría con ID ${id} no encontrada`);
        }
        await this.categoryRepo.deleteCategory(id);
    }
    async findCategories() {
        const all = await this.categoryRepo.findAllCategories();
        return all.filter(c => c.activa === 1);
    }
};
exports.CategoryService = CategoryService;
exports.CategoryService = CategoryService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [category_repository_1.CategoryRepository])
], CategoryService);
