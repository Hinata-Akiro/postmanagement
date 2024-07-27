import { Injectable, HttpStatus } from '@nestjs/common';
import { CommentsRepository } from './comments.repository';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Types } from 'mongoose';
import { ApiResponse } from '../common/utils/response';
import { CommentDocument } from './schema/comments.schema';
import { LIkeTypes } from './enums/like-types.enum';

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async addComment(
    postId: string,
    userId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<ApiResponse<CommentDocument>> {
    try {
      const newComment = await this.commentsRepository.createComment(
        new Types.ObjectId(postId),
        new Types.ObjectId(userId),
        createCommentDto.content,
        createCommentDto.parentComment
          ? new Types.ObjectId(createCommentDto.parentComment)
          : undefined,
      );

      return {
        error: false,
        statusCode: HttpStatus.CREATED,
        message: 'Comment added successfully.',
        data: newComment,
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

  async getCommentsByPost(
    postId: string,
  ): Promise<ApiResponse<CommentDocument[]>> {
    try {
      const comments = await this.commentsRepository.findCommentsByPost(
        new Types.ObjectId(postId),
      );

      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: 'Comments retrieved successfully.',
        data: comments,
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

  async getRepliesByComment(
    commentId: string,
  ): Promise<ApiResponse<CommentDocument[]>> {
    try {
      const replies = await this.commentsRepository.findRepliesByComment(
        new Types.ObjectId(commentId),
      );

      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: 'Replies retrieved successfully.',
        data: replies,
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

  async LikeOrUnlikeCommentPost(
    commentId: string,
    userId: string,
    type: LIkeTypes,
  ): Promise<ApiResponse<CommentDocument>> {
    try {
      const comment = await this.commentsRepository.findCommentById(
        new Types.ObjectId(commentId),
      );
      if (!comment) {
        return {
          error: true,
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Comment not found.',
          data: null,
        };
      }
      const updatedComment = await this.commentsRepository.LikeOrUnlikeComment(
        new Types.ObjectId(commentId),
        new Types.ObjectId(userId),
        type,
      );
      const message =
        type === LIkeTypes.Like
          ? 'Comment liked successfully.'
          : 'Comment disliked successfully.';
      return {
        error: false,
        statusCode: HttpStatus.OK,
        message,
        data: updatedComment,
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
