import { AnnonceCategoryEnum } from '../../enums/annonceCategoryEnum';

export class CreateAnnonceDto {
  title: string;
  description: string;
  animalId: number;
  publisherId: number;
  category: AnnonceCategoryEnum;
}
