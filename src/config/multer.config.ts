import { diskStorage } from 'multer';
import { extname } from 'path';
import { randomBytes } from 'crypto'; 

export const multerConfig = {
  storage: diskStorage({
    destination: './uploads/images',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + randomBytes(8).toString('hex');
      const ext = extname(file.originalname);
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
    },
  }),
  
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1,
  },
  
  fileFilter: (req, file, callback) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error('Tipo de archivo no permitido'), false);
    }
  },
};