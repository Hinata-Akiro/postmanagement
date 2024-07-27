import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PostCategory } from '../enums/post-category.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  readonly file: Express.Multer.File;

  @IsString()
  @IsOptional()
  image?: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly content: string;

  @IsNotEmpty()
  @IsEnum(PostCategory)
  @ApiProperty({ enum: PostCategory })
  readonly category: PostCategory;
}
