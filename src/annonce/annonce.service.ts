import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annonce.dto';
import { CrudService } from '../common/crud.service';
import { Repository } from 'typeorm';
import { Annonce } from './entities/annonce.entity';
import { AnimalService } from '../animal/animal.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AnnonceService extends CrudService<Annonce> {
  constructor(
    @InjectRepository(Annonce)
    private annonceRepository: Repository<Annonce>,

    private animalService: AnimalService,
  ) {
    super(annonceRepository);
  }

  async create(createAnnonceDto: CreateAnnonceDto) {
    if (createAnnonceDto.animalId) {
      //this.animalService = new AnimalService(this.animalRepository);
      const animalId = await this.animalService.findOne(
        createAnnonceDto.animalId,
      );
      console.log(animalId);
      if (!animalId) {
        throw new NotFoundException(
          'There is no animal with the corresponding id',
        );
      }
    }
    const newAnnonce = this.annonceRepository.create(createAnnonceDto);
    newAnnonce.animal = await this.animalService.findOne(
      createAnnonceDto.animalId,
    );
    return await this.annonceRepository.save(createAnnonceDto);
  }
}
