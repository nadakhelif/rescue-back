import { IsEnum } from 'class-validator';

export enum AnimalSexeEnum {
  MALE = 'male',
  FEMALE = 'female',
}
export class StateValidation {
  @IsEnum(AnimalSexeEnum, {
    message: `Invalid State`,
  })
  state: AnimalSexeEnum;
}
