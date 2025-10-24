
import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";

const PORT = process.env.PORT ?? 4000;

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
        return {filename: file.filename, path: `http://localhost:${PORT}/public/uploads/${file.filename}`};
    }
}