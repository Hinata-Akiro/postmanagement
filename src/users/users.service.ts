import { Injectable, HttpStatus } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user-dto';
import { ApiResponse } from '../common/utils/response';
import { hashPassword } from '../common/utils/auth.helper';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { CloudinaryService } from 'src/common/services/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<UserResponseDto>> {
    try {
      const existingUser = await this.usersRepository.findOne({
        email: createUserDto.email.toLowerCase(),
      });

      if (existingUser) {
        return {
          error: true,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'You already have an existing account. Please login.',
          data: null,
        };
      }

      const hashedPassword = await hashPassword(createUserDto.password);

      const createdUser = await this.usersRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      const userResponseDto: UserResponseDto = {
        firstName: createdUser.firstName,
        lastName: createdUser.lastName,
        email: createdUser.email,
        role: createdUser.role,
        active: createdUser.active,
      };

      return {
        error: false,
        statusCode: HttpStatus.CREATED,
        message: 'User created successfully.',
        data: userResponseDto,
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

  async findById(id: string) {
    const user = await this.usersRepository.findById(new Types.ObjectId(id));
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ email });
    return user;
  }

  async UpdateUser(
    userId: string,
    updateUserData: UpdateUserDto,
    file: Express.Multer.File,
  ): Promise<ApiResponse<UserResponseDto>> {
    try {
      if (file) {
        updateUserData.image = await this.cloudinaryService.uploadImage(
          file,
          'users',
        );
      }
      const user = await this.usersRepository.findById(
        new Types.ObjectId(userId),
      );

      if (!user) {
        return {
          error: true,
          statusCode: HttpStatus.BAD_REQUEST,
          message: 'User not found.',
          data: null,
        };
      }

      const updatedUser = await this.usersRepository.updateOne(
        new Types.ObjectId(userId),
        updateUserData,
      );

      const userResponseDto: UserResponseDto = {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        active: updatedUser.active,
        image: updatedUser.image,
      };

      return {
        error: false,
        statusCode: HttpStatus.OK,
        message: 'User updated successfully.',
        data: userResponseDto,
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
