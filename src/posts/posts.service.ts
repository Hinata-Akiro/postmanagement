import { Injectable } from '@nestjs/common';
import { CloudinaryService } from 'src/common/services/cloudinary.service';
import { PostsRepository } from './post.repository';
import { CreatePostDto } from './dtos/create-post.dto';
import { PostDocument } from './schema/post.schema';
import { Types } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createPost(
    createPostDto: CreatePostDto,
    user: string,
    file: Express.Multer.File,
  ): Promise<PostDocument> {
    if (file) {
      createPostDto.image = await this.cloudinaryService.uploadImage(
        file,
        'posts',
      );
    }
    return this.postsRepository.create(createPostDto, new Types.ObjectId(user));
  }
}
