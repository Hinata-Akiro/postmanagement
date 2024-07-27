// src/posts/schemas/post.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { PostCategory } from '../enums/post-category.enum';

export type PostDocument = Post & Document;
@Schema({ timestamps: true, strict: false, toJSON: { virtuals: true } })
export class Post extends Document {
  @Prop({ required: true, type: MongooseSchema.Types.String })
  image: string;

  @Prop({ required: true, type: MongooseSchema.Types.String })
  content: string;

  @Prop({
    required: true,
    type: MongooseSchema.Types.String,
    enum: PostCategory,
  })
  category: PostCategory;

  @Prop({ default: 0, type: MongooseSchema.Types.Number })
  upVotes: number;

  @Prop({ default: 0, type: MongooseSchema.Types.Number })
  downVotes: number;

  @Prop({ default: 0, type: MongooseSchema.Types.Number })
  viewCount: number;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    index: true,
    ref: 'User',
  })
  user: Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
