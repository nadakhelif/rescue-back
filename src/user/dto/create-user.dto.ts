/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty } from 'class-validator';
import { AnnonceEntity } from 'src/annonce/entities/annonce';

export class CreateUserDto {
  @IsNotEmpty()
  firstname: string;

  @IsNotEmpty()
  lastname: string;

  // @IsPhoneNumber('TN', { message: 'invalid phone number' })
  // @IsNotEmpty()
  // phoneNumber: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;

  favoris: AnnonceEntity[];
}
