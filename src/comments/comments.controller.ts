// src/comments/comments.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiResponse,
  ApiBearerAuth,
  ApiTags,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { ApiResponse as ApiResponseType } from '../common/utils/response';
import { CommentDocument } from './schema/comments.schema';
import { LIkeTypes } from './enums/like-types.enum';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post(':postId')
  @ApiResponse({ status: 201, description: 'Comment added successfully.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  @ApiBody({ type: CreateCommentDto })
  async addComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: any,
  ): Promise<ApiResponseType<CommentDocument>> {
    const userId = req['user'].id;
    return this.commentsService.addComment(postId, userId, createCommentDto);
  }

  @Get(':postId')
  @ApiResponse({ status: 200, description: 'Comments retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  async getCommentsByPost(
    @Param('postId') postId: string,
  ): Promise<ApiResponseType<CommentDocument[]>> {
    return this.commentsService.getCommentsByPost(postId);
  }

  @Get('replies/:commentId')
  @ApiResponse({ status: 200, description: 'Replies retrieved successfully.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  async getRepliesByComment(
    @Param('commentId') commentId: string,
  ): Promise<ApiResponseType<CommentDocument[]>> {
    return this.commentsService.getRepliesByComment(commentId);
  }

  @Patch(':commentId/vote/:type')
  @ApiResponse({ status: 200, description: 'Comment voted successfully.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred.' })
  @ApiQuery({ name: 'type', enum: LIkeTypes, required: true })
  @ApiBearerAuth()
  @UseGuards(AuthGuard())
  async voteComment(
    @Param('commentId') commentId: string,
    @Query('type') type: LIkeTypes,
    @Req() req: Request,
  ): Promise<ApiResponseType<CommentDocument>> {
    const userId = req['user'].id;
    return this.commentsService.LikeOrUnlikeCommentPost(
      commentId,
      userId,
      type,
    );
  }
}
