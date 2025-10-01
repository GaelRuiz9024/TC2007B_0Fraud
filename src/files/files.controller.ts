/* eslint-disable prettier/prettier */

import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";

@Controller("files")
export class FileController {
    @Post("upload")
    @UseInterceptors(FileInterceptor('file',{
        storage: diskStorage({
            destination: join(__dirname, '..', '..','public', 'uploads'),
            filename: (req, file, cb) => {
                const name= file.originalname.replace(" ","_");
                cb(null, name);
            },
        })
    }))
    uploadFile(@UploadedFile() file:Express.Multer.File){
        return {filename: file.filename, path: `http://localhost:3000/public/uploads/${file.filename}`};
    }
}