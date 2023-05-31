import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/entities/user';

export class CreateConversationDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
