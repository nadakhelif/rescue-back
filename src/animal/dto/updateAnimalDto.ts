/* eslint-disable prettier/prettier */
import { IsOptional } from 'class-validator';
import { AnimalSexeEnum } from 'src/enums/animalSexeEnum';

export class UpdateAnimalDto {
  @IsOptional()
  name: string;
  @IsOptional()
  photo: string;
  @IsOptional()
  race: string;
  @IsOptional()
  sexe: AnimalSexeEnum;
  @IsOptional()
  description: string;
  @IsOptional()
  type: string;
  @IsOptional()
  age: string;
}
