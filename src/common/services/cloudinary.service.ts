import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import * as toStream from 'buffer-to-stream';
import { validateFile, formatFileName } from '../utils/file-utils';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
    fileClass: string,
  ): Promise<string> {
    validateFile(file);

    const fileName = formatFileName(fileClass, file.mimetype);
    return new Promise<string>((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        { public_id: fileName },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        },
      );

      toStream(file.buffer).pipe(upload);
    });
  }
}
