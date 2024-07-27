import { HttpException, HttpStatus } from '@nestjs/common';

const AllowedMimeType = ['image/jpeg', 'image/png', 'image/gif'];

export function validateFile(file: Express.Multer.File): void {
  if (!AllowedMimeType.includes(file.mimetype)) {
    throw new HttpException(
      `${file.originalname} has an invalid file type`,
      HttpStatus.BAD_REQUEST,
    );
  }
  if (file.size > 10000000) {
    throw new HttpException(
      `${file.originalname} should be less than 10MB`,
      HttpStatus.BAD_REQUEST,
    );
  }
}

export function formatFileName(fileClass: string, mimetype: string): string {
  const timeInMilliseconds = new Date().getTime();
  return `${fileClass}/${timeInMilliseconds}.${mimetype.split('/')[1]}`;
}
