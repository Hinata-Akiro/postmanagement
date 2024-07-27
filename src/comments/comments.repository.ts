// src/comments/comments.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentDocument, Comment } from './schema/comments.schema';
import { LIkeTypes } from './enums/like-types.enum';

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

  async findCommentById(commentId: Types.ObjectId): Promise<CommentDocument> {
    return this.commentModel.findById(commentId);
  }

  async findCommentsByPost(postId: Types.ObjectId): Promise<CommentDocument[]> {
    return this.commentModel.find({ post: postId, parentComment: null }).exec();
  }

  async findRepliesByComment(
    parentComment: Types.ObjectId,
  ): Promise<CommentDocument[]> {
    return this.commentModel.find({ parentComment }).exec();
  }

  async LikeOrUnlikeComment(
    commentId: Types.ObjectId,
    userId: Types.ObjectId,
    type: LIkeTypes,
  ): Promise<CommentDocument> {
    const comment = await this.commentModel.findById(commentId);
    const update: any = {};

    if (type === LIkeTypes.Like) {
      if (comment.likedBy.includes(userId)) {
        return comment;
      }
      update.$addToSet = { likedBy: userId };
      update.$pull = { dislikedBy: userId };
      update.$inc = {
        likes: 1,
        dislikes: comment.dislikedBy.includes(userId) ? -1 : 0,
      };
    } else {
      if (comment.dislikedBy.includes(userId)) {
        return comment;
      }
      update.$addToSet = { dislikedBy: userId };
      update.$pull = { likedBy: userId };
      update.$inc = {
        dislikes: 1,
        likes: comment.likedBy.includes(userId) ? -1 : 0,
      };
    }

    const updatedComment = await this.commentModel.findByIdAndUpdate(
      commentId,
      update,
      {
        new: true,
      },
    );
    if (updatedComment.likes < 0 || updatedComment.dislikes < 0) {
      await this.commentModel.findByIdAndUpdate(commentId, {
        $max: { likes: 0, dislikes: 0 },
      });
    }

    return updatedComment;
  }
}
