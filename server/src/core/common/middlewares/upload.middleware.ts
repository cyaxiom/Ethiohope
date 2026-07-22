import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { HttpException } from '../errors/HttpException';
import HttpStatusCodes from '../utils/HttpStatusCodes';

/**
 * Configure storage for multer
 * Stores files in src/public/uploads/{category}
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Category can be passed as a param (e.g., /upload/programs)
    const category = req.params.category || 'others';
    // We store in the project root's public/uploads folder so it is not deleted when dist/ is removed
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', category);
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate a unique filename: timestamp-random-originalName
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const sanitizedOriginalName = file.originalname.replace(/\s+/g, '-').toLowerCase();
    cb(null, `${uniqueSuffix}-${sanitizedOriginalName}`);
  },
});

/**
 * Filter for images only
 */
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedMimeTypes = [
    'image/',
    'video/',
    'audio/',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain'
  ];

  const isAllowed = allowedMimeTypes.some(type => file.mimetype.startsWith(type));

  if (isAllowed) {
    cb(null, true);
  } else {
    cb(new HttpException(HttpStatusCodes.BAD_REQUEST, `File type ${file.mimetype} is not supported.`), false);
  }
};

/**
 * Multer upload middleware
 */
export const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
