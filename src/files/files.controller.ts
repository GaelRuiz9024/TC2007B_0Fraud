
import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { diskStorage } from "multer";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiResponse, ApiProperty, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/common/guards/jwt-auth.guard";

const PORT = process.env.PORT ?? 4000;

export class FileUploadResponseDto {
    @ApiProperty({ example: "mi_archivo.png", description: "Nombre del archivo guardado" })
    filename: string;

    @ApiProperty({ example: `http://localhost:4000/public/uploads/mi_archivo.png`, description: "Ruta de acceso pública al archivo" })
    path: string;
}

@ApiTags("Archivos") 
@Controller("files")

export class FileController {
    @Post("upload")
    @UseGuards(JwtAuthGuard) 
    @ApiBearerAuth() 
    @UseInterceptors(FileInterceptor('file',{ 
        storage: diskStorage({
            destination: join(__dirname, '..', '..','public', 'uploads'),
            filename: (req, file, cb) => {
                const name= file.originalname.replace(" ","_");
                cb(null, name);
            },
        })
    }))
    @ApiOperation({ summary: 'Subir un archivo (Requiere autenticación)' })
    @ApiConsumes('multipart/form-data') 
    @ApiBody({
        description: 'Archivo a subir (campo "file")',
        schema: {
            type: 'object',
            properties: {
                file: { 
                    type: 'string',
                    format: 'binary', 
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'Archivo subido exitosamente.', type: FileUploadResponseDto })
    @ApiResponse({ status: 401, description: 'No autorizado.' })
    @ApiResponse({ status: 400, description: 'No se proporcionó ningún archivo.' })
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