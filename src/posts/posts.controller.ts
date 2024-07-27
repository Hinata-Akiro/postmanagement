import {
  Body,
  Controller,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dtos/create-post.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiResponse({ status: 201, description: 'Blog post created successfully.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePostDto })
  @UseInterceptors(FileInterceptor('file'))
  async createBlog(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const UserId = req['user'];
    console.log(UserId);
    return this.postsService.createPost(createPostDto, UserId, file);
  }
}
