// src/comments/comments.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentDocument, Comment } from './schema/comments.schema';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async createComment(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
    content: string,
    parentComment?: Types.ObjectId,
  ): Promise<CommentDocument> {
    const comment = new this.commentModel({
      post: postId,
      user: userId,
      content,
      parentComment,
    });
    return comment.save();
  }

  async findCommentsByPost(postId: Types.ObjectId): Promise<CommentDocument[]> {
    return this.commentModel.find({ post: postId, parentComment: null }).exec();
  }

  async findRepliesByComment(
    parentComment: Types.ObjectId,
  ): Promise<CommentDocument[]> {
    return this.commentModel.find({ parentComment }).exec();
  }
}
