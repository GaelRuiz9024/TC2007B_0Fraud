

import { Module } from "@nestjs/common";
import { FileController } from "./files.controller";


@Module({
    controllers: [FileController],
})
export class FilesModule{}