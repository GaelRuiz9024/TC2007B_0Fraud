
import { Module } from "@nestjs/common";
import { TipsController } from "./tips.controller";
import { TipsService } from "./tips.service";
import { TipsRepository } from "./tips.repository";

@Module({
    controllers: [TipsController],
    providers: [TipsService, TipsRepository],
    exports: [TipsService]
})
export class TipsModule {}
