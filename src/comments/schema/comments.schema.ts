// src/comments/schemas/comment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true, strict: false, toJSON: { virtuals: true } })
export class Comment extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, index: true, ref: 'Post' })
  post: Types.ObjectId;

  @Prop({ required: true })
  content: string;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: 'User',
  })
  user: Types.ObjectId;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
