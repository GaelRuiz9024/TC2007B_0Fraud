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
exports.UserRepository = void 0;
const common_1 = require("@nestjs/common");
const db_service_1 = require("../db/db.service");
let UserRepository = class UserRepository {
    dbService;
    constructor(dbService) {
        this.dbService = dbService;
    }
    async registerUser(correo, nombre, apellidos, contrasena) {
        const sql = `INSERT INTO usuario (correo,nombre,apellidos,contrasenaHash,salt) VALUES (?,?,?,?,'saltTest')`;
        await this.dbService.getPool().query(sql, [correo, nombre, apellidos, contrasena]);
    }
    async findByEmail(correo) {
        const sql = `SELECT * FROM usuario WHERE correo=? LIMIT 1`;
        const [rows] = await this.dbService.getPool().query(sql, [correo]);
        const result = rows;
        return result[0];
    }
    async findById(id) {
        const sql = `SELECT * FROM usuario WHERE id=? LIMIT 1`;
        const [rows] = await this.dbService.getPool().query(sql, [id]);
        const result = rows;
        return result[0];
    }
    async updateUser(id, updateData) {
        const fields = Object.keys(updateData);
        const values = Object.values(updateData);
        if (fields.length === 0) {
            throw new Error("No hay datos para actualizar");
        }
        const setClause = fields.map(field => `${field}=?`).join(', ');
        const sql = `UPDATE usuario SET ${setClause} WHERE id=?`;
        values.push(id);
        await this.dbService.getPool().query(sql, values);
        return this.findById(id);
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [db_service_1.DbService])
], UserRepository);
//# sourceMappingURL=user.repository.js.map