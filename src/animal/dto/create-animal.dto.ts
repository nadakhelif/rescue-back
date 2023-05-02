import { AnimalSexeEnum } from 'src/enums/animalSexeEnum';
import { IsNotEmpty } from 'class-validator';

export class CreateAnimalDto {
  @IsNotEmpty()
  name: string;
  photo: string;
  @IsNotEmpty()
  race: string;
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  type: string;
  @IsNotEmpty()
  age: number;
}
