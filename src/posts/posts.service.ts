// src/posts/posts.service.ts
import { Injectable, HttpStatus } from '@nestjs/common';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { PostsRepository } from './post.repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostDocument } from './schema/post.schema';
import { Types } from 'mongoose';
import { ApiResponse } from 'src/common/utils/response';
import { UpdatePostDto } from './dtos/update-post.dto';
import { PagingOptions } from 'src/common/utils/pagination.dto';
import { PostResponseDto } from './dtos/post-response.dto';
import { PostCategory } from './enums/post-category.enum';
import { VoteType } from './enums/vote-type.enum';
import { MemcacheService } from 'src/common/cache/memcache.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly cloudinaryService: CloudinaryService,
    private readonly memcacheService: MemcacheService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    user: string,
    file: Express.Multer.File,
  ): Promise<ApiResponse<PostDocument>> {
    try {
      if (file) {
        createPostDto.image = await this.cloudinaryService.uploadImage(
          file,
          'posts',
        );
      }
      const newPost = await this.postsRepository.create(
        createPostDto,
        new Types.ObjectId(user),
      );
      return {
        error: false,
        statusCode: HttpStatus.CREATED,
        message: 'Post created successfully.',
        data: newPost,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
        data: null,
      };
    }
  }

  async updatePost(
    postId: string,
    userId: string,
    updatePostDto: UpdatePostDto,
    file?: Express.Multer.File,
  ): Promise<ApiResponse<PostDocument>> {
    try {
      const post = await this.postsRepository.findById(
        new Types.ObjectId(postId),
      );

      if (!post) {
        return {
          error: true,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Post not found.',
          data: null,
        };
      }

      if (post.user.toHexString() !== userId) {
        return {
          error: true,
          statusCode: HttpStatus.FORBIDDEN,
          message: 'You do not have permission to edit this post.',
          data: null,
        };
      }

      if (file) {
        updatePostDto.image = await this.cloudinaryService.uploadImage(
          file,
          'posts',
        );
      }

      const updatedPost = await this.postsRepository.update(
        new Types.ObjectId(postId),
        updatePostDto,
      );

      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: 'Post updated successfully.',
        data: updatedPost,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
        data: null,
      };
    }
  }

  async deletePost(postId: string, userId: string): Promise<ApiResponse<null>> {
    try {
      const post = await this.postsRepository.findById(
        new Types.ObjectId(postId),
      );

      if (!post) {
        return {
          error: true,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Post not found.',
          data: null,
        };
      }

      if (post.user.toHexString() !== userId) {
        return {
          error: true,
          statusCode: HttpStatus.FORBIDDEN,
          message: 'You do not have permission to delete this post.',
          data: null,
        };
      }
      await this.postsRepository.delete({ _id: new Types.ObjectId(postId) });

      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: 'Post deleted successfully.',
        data: null,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
        data: null,
      };
    }
  }

  async getPostByUserId(
    userId: string,
    category?: PostCategory,
    sortBy?: string,
    pagingOptions?: PagingOptions,
  ): Promise<ApiResponse<PostResponseDto[]>> {
    try {
      const cacheKey = `postsByUser_${userId}_${category}_${sortBy}_${pagingOptions?.skip}_${pagingOptions?.limit}`;
      const cachedPosts = await this.memcacheService.get(cacheKey);

      if (cachedPosts) {
        return {
          error: false,
          statusCode: HttpStatus.OK,
          message: 'Posts retrieved successfully from cache.',
          data: cachedPosts,
        };
      }

      const filter: any = {};
      if (category) {
        filter.category = category;
      }

      const sort: any = {};
      if (sortBy === 'upVotes') {
        sort.upVotes = pagingOptions?.getSortObject();
      } else if (sortBy === 'createdAt') {
        sort.createdAt = pagingOptions?.getSortObject();
      }

      const posts = await this.postsRepository.findAllPosts(
        filter,
        sort,
        pagingOptions,
        userId,
      );

      await this.memcacheService.set(cacheKey, posts);

      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: 'Posts retrieved successfully.',
        data: posts,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
        data: null,
      };
    }
  }

  async getPosts(
    category?: PostCategory,
    sortBy?: string,
    pagingOptions?: PagingOptions,
  ): Promise<ApiResponse<PostResponseDto[]>> {
    try {
      const cacheKey = `allPosts_${category}_${sortBy}_${pagingOptions?.skip}_${pagingOptions?.limit}`;
      const cachedPosts = await this.memcacheService.get(cacheKey);

      if (cachedPosts) {
        return {
          error: false,
          statusCode: HttpStatus.OK,
          message: 'Posts retrieved successfully',
          data: cachedPosts,
        };
      }

      const filter: any = {};
      if (category) {
        filter.category = category;
      }

      const sort: any = {};
      if (sortBy === 'upVotes') {
        sort.upVotes = pagingOptions?.getSortObject();
      } else if (sortBy === 'createdAt') {
        sort.createdAt = pagingOptions?.getSortObject();
      }

      const posts = await this.postsRepository.findAllPosts(
        filter,
        sort,
        pagingOptions,
      );

      await this.memcacheService.set(cacheKey, posts);

      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: 'Posts retrieved successfully.',
        data: posts,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
        data: null,
      };
    }
  }
  async votePost(
    postId: string,
    voteType: VoteType,
  ): Promise<ApiResponse<PostDocument>> {
    try {
      const post = await this.postsRepository.findById(
        new Types.ObjectId(postId),
      );
      if (!post) {
        return {
          error: true,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Post not found.',
          data: null,
        };
      }
      const updatedPost = await this.postsRepository.votePost(
        new Types.ObjectId(postId),
        voteType,
      );
      const message =
        voteType === VoteType.UPVOTE
          ? 'Post upvoted successfully.'
          : 'Post downvoted successfully.';
      return {
        error: false,
        statusCode: HttpStatus.OK,
        message,
        data: updatedPost,
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
        data: null,
      };
    }
  }

  async getPostById(postId: string): Promise<ApiResponse<any>> {
    try {
      const post = await this.postsRepository.findByIdWithComments(
        new Types.ObjectId(postId),
      );

      if (!post || post.length === 0) {
        return {
          error: true,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Post not found.',
          data: null,
        };
      }

      await this.postsRepository.incrementViewCount(new Types.ObjectId(postId));

      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: 'Post retrieved successfully.',
        data: post[0],
      };
    } catch (error) {
      return {
        error: true,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        message: error.message || 'An unexpected error occurred.',
        data: null,
      };
    }
  }
}
