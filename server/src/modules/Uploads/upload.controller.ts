import { NextFunction, Request, Response } from 'express';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';

export class UploadController {
  /**
   * Handle single file upload
   */
  public uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'No file uploaded',
        });
      }

      const category = req.params.category || 'others';
      // The URL that will be used to access the file
      // We assume the server serves 'src/public/uploads' at '/uploads'
      const fileUrl = `/uploads/${category}/${req.file.filename}`;

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url: fileUrl,
          filename: req.file.filename,
          mimetype: req.file.mimetype,
          size: req.file.size,
        },
      });
    } catch (error) {
      next(error);
    }
  };
}
