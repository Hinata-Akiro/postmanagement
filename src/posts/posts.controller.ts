import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
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
  ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PagingOptions } from 'src/common/utils/pagination.dto';
import { PostCategory } from './enums/post-category.enum';

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
    return this.postsService.createPost(createPostDto, UserId, file);
  }

  @Put(':id')
  @ApiResponse({ status: 200, description: 'Blog post updated successfully.' })
  @ApiResponse({ status: 400, description: 'Post not found or forbidden.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePostDto })
  @UseInterceptors(FileInterceptor('file'))
  async updateBlog(
    @Param('id') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req['user'].id;
    return this.postsService.updatePost(postId, userId, updatePostDto, file);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Blog post deleted successfully.' })
  @ApiResponse({ status: 400, description: 'Post not found or forbidden.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async deleteBlog(@Param('id') postId: string, @Req() req: Request) {
    const userId = req['user'].id;
    return this.postsService.deletePost(postId, userId);
  }

  @Get()
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiQuery({ name: 'category', enum: PostCategory, required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'page', required: false, schema: { default: 1 } })
  @ApiQuery({ name: 'limit', required: false, schema: { default: 10 } })
  async getPosts(
    @Query('category') category?: PostCategory,
    @Query('sortBy') sortBy?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    const pagingOptions: PagingOptions = {
      skip: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      sort: sortBy === 'asc' || sortBy === 'desc' ? sortBy : 'desc',
      getSortObject: function (): 1 | -1 {
        throw new Error('Function not implemented.');
      },
    };
    return this.postsService.getPosts(category, sortBy, pagingOptions);
  }

  @Patch(':id/vote/:type')
  @ApiResponse({ status: 200, description: 'Post voted successfully.' })
  @ApiResponse({ status: 400, description: 'Post not found.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async votePost(
    @Param('id') postId: string,
    @Param('type') type: 'upvote' | 'downvote',
  ) {
    return this.postsService.votePost(postId, type);
  }

  @Get(':postId')
  @ApiResponse({ status: 200, description: 'Post retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getPostById(@Param('postId') postId: string) {
    return this.postsService.getPostById(postId);
  }
}
