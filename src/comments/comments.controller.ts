// src/comments/comments.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiBearerAuth, ApiTags, ApiBody } from '@nestjs/swagger';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { ApiResponse as ApiResponseType } from '../common/utils/response';
import { CommentDocument } from './schema/comments.schema';

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
}
