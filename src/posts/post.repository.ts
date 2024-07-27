/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { Post, PostDocument } from './schema/post.schema';
import { CreatePostDto } from './dtos/create-post.dto';
import { PagingOptions } from 'src/common/utils/pagination.dto';
import { PostResponseDto } from './dtos/post-response.dto';
import { VoteType } from './enums/vote-type.enum';

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

  public async findAllPosts(
    filter: FilterQuery<PostDocument> = {},
    sort: any = { createdAt: -1 },
    option: PagingOptions = {
      skip: 0,
      limit: 10,
      sort: 'desc',
      getSortObject: function (): 1 | -1 {
        return -1;
      },
    },
    userId?: string,
  ): Promise<PostResponseDto[]> {
    const skip = option.skip || 0;
    const limit = option.limit || 10;

    const sortObj: Record<string, 1 | -1> = {};
    for (const key in sort) {
      sortObj[key] = sort[key] === 'asc' ? 1 : -1;
    }

    if (userId) {
      filter.user = new Types.ObjectId(userId);
    }

    return this.postModel.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $lookup: {
          from: 'comments',
          localField: '_id',
          foreignField: 'post',
          as: 'comments',
        },
      },
      {
        $addFields: {
          commentCount: { $size: '$comments' },
        },
      },
      {
        $lookup: {
          from: 'comments',
          let: { postId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ['$post', '$$postId'] },
                parentComment: { $exists: true },
              },
            },
          ],
          as: 'replies',
        },
      },
      {
        $addFields: {
          replyCommentCount: { $size: '$replies' },
        },
      },
      {
        $project: {
          _id: 1,
          image: 1,
          content: 1,
          category: 1,
          upVotes: 1,
          downVotes: 1,
          viewCount: 1,
          replyCommentCount: 1,
          commentCount: 1,
          createdAt: 1,
          updatedAt: 1,
          'userDetails.firstName': 1,
          'userDetails.lastName': 1,
          'userDetails.image': 1,
        },
      },
      {
        $sort: Object.keys(sortObj).length ? sortObj : { createdAt: -1 },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]);
  }

  public async votePost(
    postId: Types.ObjectId,
    voteType: VoteType,
  ): Promise<PostDocument> {
    const update =
      voteType === VoteType.UPVOTE
        ? { $inc: { upVotes: 1 } }
        : { $inc: { downVotes: 1 } };
    return this.postModel.findByIdAndUpdate(postId, update, { new: true });
  }

  public async findByIdWithComments(postId: Types.ObjectId): Promise<any> {
    return this.postModel
      .aggregate([
        {
          $match: { _id: postId },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $lookup: {
            from: 'comments',
            let: { postId: '$_id' },
            pipeline: [
              { $match: { $expr: { $eq: ['$post', '$$postId'] } } },
              {
                $lookup: {
                  from: 'users',
                  localField: 'user',
                  foreignField: '_id',
                  as: 'userDetails',
                },
              },
              {
                $unwind: '$userDetails',
              },
              {
                $lookup: {
                  from: 'comments',
                  let: { parentCommentId: '$_id' },
                  pipeline: [
                    {
                      $match: {
                        $expr: { $eq: ['$parentComment', '$$parentCommentId'] },
                      },
                    },
                    {
                      $lookup: {
                        from: 'users',
                        localField: 'user',
                        foreignField: '_id',
                        as: 'userDetails',
                      },
                    },
                    {
                      $unwind: '$userDetails',
                    },
                  ],
                  as: 'replies',
                },
              },
            ],
            as: 'comments',
          },
        },
        {
          $project: {
            _id: 1,
            image: 1,
            content: 1,
            category: 1,
            upVotes: 1,
            downVotes: 1,
            viewCount: 1,
            createdAt: 1,
            updatedAt: 1,
            'userDetails.firstName': 1,
            'userDetails.lastName': 1,
            'userDetails.image': 1,
            comments: {
              _id: 1,
              content: 1,
              createdAt: 1,
              'userDetails.firstName': 1,
              'userDetails.lastName': 1,
              'userDetails.image': 1,
              replies: {
                _id: 1,
                content: 1,
                createdAt: 1,
                'userDetails.firstName': 1,
                'userDetails.lastName': 1,
                'userDetails.image': 1,
              },
            },
          },
        },
      ])
      .exec();
  }
}
