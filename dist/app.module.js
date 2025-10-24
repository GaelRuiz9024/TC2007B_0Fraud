"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const db_module_1 = require("./db/db.module");
const user_module_1 = require("./users/user.module");
const auth_module_1 = require("./auth/auth.module");
const jwt_1 = require("@nestjs/jwt");
const admin_module_1 = require("./admin/admin.module");
const report_module_1 = require("./reports/report.module");
const category_module_1 = require("./category/category.module");
const analytics_module_1 = require("./analytics/analytics.module");
const tips_module_1 = require("./tips/tips.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [jwt_1.JwtModule.register({
                global: true,
                secret: process.env.JWT_SECRET || 'supersecret',
            }),
            db_module_1.DbModule, user_module_1.UserModule, auth_module_1.AuthModule, admin_module_1.AdminModule, report_module_1.ReportModule, category_module_1.CategoryModule, analytics_module_1.AnalyticsModule, tips_module_1.TipsModule],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
