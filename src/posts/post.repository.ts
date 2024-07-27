/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { CreatePostDto } from './dtos/create-post.dto';
import { PagingOptions } from 'src/common/utils/pagination.dto';

@Injectable()
export class PostsRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<PostDocument>) {}

  async create(
    createPost: Partial<Post>,
    userId: Types.ObjectId,
  ): Promise<PostDocument> {
    return this.postModel.create({
      ...createPost,
      user: userId,
    });
  }

  public async find(
    findQuery?: FilterQuery<PostDocument>,
    option?: PagingOptions,
    extra?: any,
  ): Promise<PostDocument[]> {
    return this.postModel
      .find(findQuery)
      .skip(option?.skip)
      .limit(option?.limit)
      .exec();
  }

  public async findById(id: Types.ObjectId): Promise<PostDocument> {
    return this.postModel.findById(id);
  }

  public async findOne(query: FilterQuery<PostDocument>) {
    return this.postModel.findOne(query).exec();
  }

  public async update(
    id: Types.ObjectId,
    updateData: UpdateQuery<PostDocument>,
  ): Promise<PostDocument> {
    return this.postModel.findByIdAndUpdate({ _id: id }, updateData, {
      new: true,
    });
  }

  public async delete(query: FilterQuery<PostDocument>) {
    return this.postModel.findByIdAndDelete(query);
  }

  async save(post: PostDocument): Promise<PostDocument> {
    return post.save();
  }
}
