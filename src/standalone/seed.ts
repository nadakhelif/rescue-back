import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { AnimalService } from '../animal/animal.service';
import { AnnonceService } from '../annonce/annonce.service';
import { Animal } from '../animal/entities/animal';
import {
  randAvatar,
  randDrinks,
  randFirstName,
  randFullName,
  randJobTitle,
  randLastName,
  randNumber,
  randPersonTitle,
  randSkill,
  randSuperhero,
} from '@ngneat/falso';
import { AnimalSexeEnum } from '../enums/animalSexeEnum';
import { AnnonceCategoryEnum } from '../enums/annonceCategoryEnum';

import { CreateAnnonceDto } from '../annonce/dto/create-annonce.dto';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const annimalservice: AnimalService = app.get(AnimalService);
  const annonceService: AnnonceService = app.get(AnnonceService);

  for (let i = 0; i < 9; i++) {
    const animal = new Animal();
    animal.name = randFullName();
    animal.age = randNumber();
    animal.race = randFullName();
    animal.photo = randDrinks();
    animal.description = randJobTitle();
    animal.type = randAvatar();
    animal.sexe = AnimalSexeEnum.FEMALE;
    await annimalservice.create(animal);
  }
  const animals = await annimalservice.findAll();
  for (const animal of animals) {
    const annonce = new CreateAnnonceDto();
    annonce.title = randPersonTitle();
    annonce.description = randAvatar();
    annonce.category = AnnonceCategoryEnum.cat;
    annonce.animalId = animal.id;
    annonce.publisherId = 1;

    await annonceService.create(annonce);
  }
}
