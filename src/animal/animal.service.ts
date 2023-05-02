import { Animal } from './entities/animal';
import { Injectable } from '@nestjs/common';
import { CrudService } from 'src/common/crud.service';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAnimalDto } from './dto/create-animal.dto';

@Injectable()
export class AnimalService extends CrudService<Animal> {
  constructor(
    @InjectRepository(Animal)
    private animalRepository: Repository<Animal>,
  ) {
    super(animalRepository);
  }
  async create(createAnimalDto: CreateAnimalDto) {
    let animal = this.animalRepository.create(createAnimalDto);
    animal = await this.animalRepository.save(createAnimalDto);
    return animal;
  }
  async filterByage(min, max): Promise<Animal[]> {
    const qb = this.animalRepository.createQueryBuilder('animal');
    const animals = qb
      .where('animal.age >= :min', { min })
      .andWhere('animal.age <= :max', { max })
      .getMany();
    return animals;
  }
  async filterBySexe(sexe): Promise<Animal[]> {
    return await this.animalRepository
      .createQueryBuilder('animal')
      .where('animal.sexe = :sexe', { sexe })
      .getMany();
  }
  async filterByRace(race): Promise<Animal[]> {
    return await this.animalRepository
      .createQueryBuilder('animal')
      .where('animal.race = :race', { race })
      .getMany();
  }
  async filterByType(type): Promise<Animal[]> {
    return await this.animalRepository
      .createQueryBuilder('animal')
      .where('animal.type = :type', { type })
      .getMany();
  }
}
