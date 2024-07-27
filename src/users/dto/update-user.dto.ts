import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  readonly file: Express.Multer.File;

  @IsString()
  @IsOptional()
  image?: string;
}
