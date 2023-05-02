import { IsEnum } from 'class-validator';

export enum AnnonceStateEnum {
  AVAILABLE = 'available',
  NOTAVAILABE = 'not-available',
}
export class StateValidation {
  @IsEnum(AnnonceStateEnum, {
    message: `Invalid State`,
  })
  state: AnnonceStateEnum;
}
