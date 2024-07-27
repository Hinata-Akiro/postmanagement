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
  ApiOperation,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dtos/create-post.dto';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PagingOptions } from 'src/common/utils/pagination.dto';
import { PostCategory } from './enums/post-category.enum';
import { VoteType } from './enums/vote-type.enum';
import { PostResponseDto } from './dtos/post-response.dto';

@ApiTags('posts')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new blog post' })
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
  @ApiOperation({ summary: 'Update a blog post' })
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
  @ApiOperation({ summary: 'Delete a blog post' })
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
  @ApiOperation({ summary: 'Get all blog posts' })
  @ApiResponse({ status: 200, description: 'Posts retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiQuery({ name: 'category', enum: PostCategory, required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'page', required: false, schema: { default: 1 } })
  @ApiQuery({ name: 'limit', required: false, schema: { default: 10 } })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
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
        return -1;
      },
    };
    return this.postsService.getPosts(category, sortBy, pagingOptions);
  }

  @Patch(':id/vote')
  @ApiOperation({ summary: 'Vote on a blog post' })
  @ApiResponse({ status: 200, description: 'Post voted successfully.' })
  @ApiResponse({ status: 400, description: 'Post not found.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiQuery({ name: 'type', enum: VoteType, required: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async votePost(@Param('id') postId: string, @Query('type') type: VoteType) {
    return this.postsService.votePost(postId, type);
  }

  @Get(':postId')
  @ApiOperation({ summary: 'Get a blog post by ID' })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully.',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Post not found.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getPostById(@Param('postId') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @Get('user-posts')
  @ApiOperation({ summary: 'Get blog posts by user ID' })
  @ApiResponse({
    status: 200,
    description: 'Posts retrieved successfully.',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiQuery({ name: 'category', enum: PostCategory, required: false })
  @ApiQuery({ name: 'sortBy', required: false })
  @ApiQuery({ name: 'page', required: false, schema: { default: 1 } })
  @ApiQuery({ name: 'limit', required: false, schema: { default: 10 } })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async getPostByUserId(
    @Req() req: Request,
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
        return -1;
      },
    };
    const userId = req['user'].id;
    return this.postsService.getPostByUserId(
      userId,
      category,
      sortBy,
      pagingOptions,
    );
  }
}
