/* eslint-disable prettier/prettier */
import { AnimalSexeEnum } from 'src/enums/animalSexeEnum';

export class AddAnimalDto {
  name: string;
  photo: string;
  race: string;
  sexe: AnimalSexeEnum;
  description: string;
  type: string;
  age: string;
}
