import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { IsOptional } from 'class-validator';
import { User } from '../entities/user';

export class UpdateUserDto extends PartialType(User) {
  @MinLength(3)
  @IsOptional()
  firstname: string;

  @MinLength(3)
  @IsOptional()
  lastname: string;

  @MinLength(8)
  @MaxLength(50)
  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  profileImage: string;
  password: any;
}
