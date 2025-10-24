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
exports.UsersCategoryRepository = exports.CategoryRepository = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../db/db.service");
const ALLOWED_FIELDS_CATEGORY = ['nombre', 'descripcion', 'activa'];
let CategoryRepository = class CategoryRepository {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    async createCategory(nombre, descripcion, activa = 1) {
        const sql = `INSERT INTO categoria (nombre, descripcion, activa) VALUES (?, ?, ?)`;
        const params = [nombre, descripcion, activa];
        await this.dbService.getPool().query(sql, params);
    }
    async findAllCategories() {
        const sql = `SELECT * FROM categoria`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows;
    }
    async updateCategory(id, updateData) {
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        if (fields.length === 0) {
            throw new Error("No hay datos para actualizar");
        }
        const validFields = fields.filter(field => ALLOWED_FIELDS_CATEGORY.includes(field));
        if (validFields.length === 0) {
            throw new Error("No hay datos válidos para actualizar");
        }
        const setClause = validFields.map(field => `${field}=?`).join(', ');
        const updateValues = validFields.map(field => updateData[field]);
        const sql = `UPDATE categoria SET ${setClause} WHERE id=?`;
        await this.dbService.getPool().query(sql, [...updateValues, id]);
        return this.findById(id);
    }
    async deleteCategory(id) {
        const sql = `UPDATE categoria SET activa=0 WHERE id=?`;
        await this.dbService.getPool().query(sql, [id]);
    }
    async findById(id) {
        const sql = `SELECT * FROM categoria WHERE id=? LIMIT 1`;
        const [rows] = await this.dbService.getPool().query(sql, [id]);
        const result = rows;
        return result[0];
    }
};
exports.CategoryRepository = CategoryRepository;
exports.CategoryRepository = CategoryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], CategoryRepository);
class UsersCategoryRepository {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    async findCategories() {
        const sql = `SELECT * FROM categoria WHERE activa = 1`;
        const [rows] = await this.dbService.getPool().query(sql);
        return rows;
    }
}
exports.UsersCategoryRepository = UsersCategoryRepository;
