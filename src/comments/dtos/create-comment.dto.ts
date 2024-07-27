import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsOptional()
  @ApiProperty({ type: 'string', format: 'ObjectId' })
  parentComment?: Types.ObjectId;
}
