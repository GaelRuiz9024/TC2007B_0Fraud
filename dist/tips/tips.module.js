"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TipsModule = void 0;
const common_1 = require("@nestjs/common");
const tips_controller_1 = require("./tips.controller");
const tips_service_1 = require("./tips.service");
const tips_repository_1 = require("./tips.repository");
let TipsModule = class TipsModule {
};
exports.TipsModule = TipsModule;
exports.TipsModule = TipsModule = __decorate([
    (0, common_1.Module)({
        controllers: [tips_controller_1.TipsController],
        providers: [tips_service_1.TipsService, tips_repository_1.TipsRepository],
        exports: [tips_service_1.TipsService]
    })
], TipsModule);
