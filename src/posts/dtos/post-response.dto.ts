import { ApiProperty } from '@nestjs/swagger';
import { PostCategory } from '../enums/post-category.enum';

class UserResponse {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  image: string;
}

export class PostResponseDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  image: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  category: PostCategory;

  @ApiProperty()
  upVotes: number;

  @ApiProperty()
  downVotes: number;

  @ApiProperty()
  viewCount: number;

  @ApiProperty()
  replyCount: number;

  @ApiProperty()
  readingTime: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: UserResponse })
  userDetails: UserResponse;
}
