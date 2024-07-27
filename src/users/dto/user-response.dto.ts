import { ApiProperty } from '@nestjs/swagger';
import { UserRoles } from '../enums/role.enums';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @ApiProperty({ description: 'First name of the user' })
  @Expose()
  firstName: string;

  @ApiProperty({ description: 'Last name of the user' })
  @Expose()
  lastName: string;

  @ApiProperty({ description: 'Email address of the user' })
  @Expose()
  email: string;

  @ApiProperty({ description: 'image of the user', required: false })
  @Expose()
  image?: string;

  @ApiProperty({ description: 'Date of birth of the user', required: false })
  @Expose()
  dateOfBirth?: Date;

  @ApiProperty({ description: 'Role of the user', enum: UserRoles })
  @Expose()
  role: UserRoles;

  @ApiProperty({ description: 'Is the user active?' })
  @Expose()
  active: boolean;
}
