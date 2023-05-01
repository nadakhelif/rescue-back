import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CrudService } from 'src/common/crud.service';
import { AnimalEntity } from './entities/animal/animal';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnonceService } from 'src/annonce/annonce.service';

@Injectable()
export class AnimalService extends CrudService<AnimalEntity> {
  constructor(
    @InjectRepository(AnimalEntity)
    private animalRepository: Repository<AnimalEntity>,
    @Inject(forwardRef(() => AnnonceService))
    private annonceService: AnnonceService,
  ) {
    super(animalRepository);
  }
  async filterByage(min, max): Promise<AnimalEntity[]> {
    const qb = this.animalRepository.createQueryBuilder('animal');
    const animals = qb
      .where('animal.age >= :min', { min })
      .andWhere('animal.age <= :max', { max })
      .getMany();
    return animals;
  }
  async filterBySexe(sexe): Promise<AnimalEntity[]> {
    return await this.animalRepository
      .createQueryBuilder('animal')
      .where('animal.sexe = :sexe', { sexe })
      .getMany();
  }
  async filterByRace(race): Promise<AnimalEntity[]> {
    return await this.animalRepository
      .createQueryBuilder('animal')
      .where('animal.race = :race', { race })
      .getMany();
  }
  async filterByType(type): Promise<AnimalEntity[]> {
    return await this.animalRepository
      .createQueryBuilder('animal')
      .where('animal.type = :type', { type })
      .getMany();
  }
}
