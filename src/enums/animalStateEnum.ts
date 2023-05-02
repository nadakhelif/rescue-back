import { IsEnum } from 'class-validator';

export enum AnimalStateEnum {
  AVAILABLE = 'available',
  ADOPTED = 'adopted',
}
export class StateValidation {
  @IsEnum(AnimalStateEnum, {
    message: `Invalid State`,
  })
  state: AnimalStateEnum;
}
