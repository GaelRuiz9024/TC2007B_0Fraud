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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersCategoryController = exports.CategoryController = exports.UpdateCategoryBody = exports.CreateCategoryBody = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const is_admin_guard_1 = require("../common/guards/is-admin.guard");
const category_service_1 = require("./category.service");
class CreateCategoryBody {
    nombre;
    descripcion;
    activa = 1;
}
exports.CreateCategoryBody = CreateCategoryBody;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Phishing', description: 'Nombre de la nueva categoría' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryBody.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Sitios que intentan robar credenciales', description: 'Descripción de la categoría' }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateCategoryBody.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1, description: 'Estado de la categoría (0: Inactiva, 1: Activa)', required: false, enum: [0, 1] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([0, 1]),
    __metadata("design:type", Number)
], CreateCategoryBody.prototype, "activa", void 0);
class UpdateCategoryBody {
    nombre;
    descripcion;
    activa;
}
exports.UpdateCategoryBody = UpdateCategoryBody;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Phishing 2.0', description: 'Nuevo nombre de la categoría', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCategoryBody.prototype, "nombre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Nueva descripción detallada', description: 'Nueva descripción de la categoría', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateCategoryBody.prototype, "descripcion", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 0, description: 'Nuevo estado de la categoría (0: Inactiva, 1: Activa)', required: false, enum: [0, 1] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([0, 1]),
    __metadata("design:type", Number)
], UpdateCategoryBody.prototype, "activa", void 0);
let CategoryController = class CategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async create(createDto) {
        await this.categoryService.createCategory(createDto);
    }
    async findAll() {
        return this.categoryService.findAllCategories();
    }
    async update(id, updateDto) {
        const categoryId = Number(id);
        return this.categoryService.updateCategory(categoryId, updateDto);
    }
    async delete(id) {
        const categoryId = Number(id);
        await this.categoryService.deleteCategory(categoryId);
    }
};
exports.CategoryController = CategoryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Crear una nueva categoría' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Categoría creada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'No autorizado / Token inválido.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Prohibido. Se requiere rol de administrador.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCategoryBody]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las categorías' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de categorías obtenida.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "findAll", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar una categoría existente' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría actualizada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, UpdateCategoryBody]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar una categoría' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Categoría eliminada exitosamente.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Categoría no encontrada.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "delete", null);
exports.CategoryController = CategoryController = __decorate([
    (0, swagger_1.ApiTags)('Admin - Gestión de Categorías'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(is_admin_guard_1.IsAdminGuard),
    (0, common_1.Controller)('admin/categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
let UsersCategoryController = class UsersCategoryController {
    categoryService;
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    async findCategories() {
        const all = await this.categoryService.findCategories();
        return all.filter(c => c.activa === 1);
    }
};
exports.UsersCategoryController = UsersCategoryController;
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener todas las categorías' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lista de categorías' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsersCategoryController.prototype, "findCategories", null);
exports.UsersCategoryController = UsersCategoryController = __decorate([
    (0, swagger_1.ApiTags)('Categorías'),
    (0, common_1.Controller)('categories'),
    __metadata("design:paramtypes", [category_service_1.CategoryService])
], UsersCategoryController);
//# sourceMappingURL=category.controller.js.map