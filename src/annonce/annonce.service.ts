import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annonce.dto';
import { CrudService } from '../common/crud.service';
import { Repository } from 'typeorm';
import { Annonce } from './entities/annonce.entity';
import { AnimalService } from '../animal/animal.service';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';
import { AnnonceStateEnum } from '../enums/annonceStateEnum';

@Injectable()
export class AnnonceService extends CrudService<Annonce> {
  constructor(
    @InjectRepository(Annonce)
    private annonceRepository: Repository<Annonce>,
    private userService: UserService,
    private animalService: AnimalService,
  ) {
    super(annonceRepository);
  }

  async create(createAnnonceDto: CreateAnnonceDto) {
    if (createAnnonceDto.animalId && createAnnonceDto.publisherId) {
      const animalId = await this.animalService.findOne(
        createAnnonceDto.animalId,
      );
      console.log(animalId);
      if (!animalId) {
        throw new NotFoundException(
          'There is no animal with the corresponding id',
        );
      }
      const publisher = await this.userService.findOne(
        createAnnonceDto.publisherId,
      );
      if (!publisher) {
        throw new NotFoundException(
          'There is no user with the corresponding publisher id',
        );
      }
      const newAnnonce = await this.annonceRepository.create({
        ...createAnnonceDto,
        publisher: publisher,
        animal: animalId,
      });
      return await this.annonceRepository.save(newAnnonce);
    }
  }

  async addToFavoris(annonceId, userId) {
    /*const annonce = await this.annonceRepository
      .createQueryBuilder('annonce')
      .select('*')
      .where('annonce.id = :id', { id: +annonceId });
    console.log(typeof +annonceId);
    console.log(annonce.getQuery());
    console.log(await annonce.getOne());*/
    const annonce = await this.annonceRepository.findOne({
      where: { id: annonceId },
    });
    console.log(annonce);
    const user = await this.userService.findOne(userId);
    console.log(user);
    //annonce.users.push(user);
    return 'added successfuly';
  }
  async deleteFromFav(annonceId, userId) {
    const user = await this.userService.findOne(userId);
    const annonce = await this.annonceRepository.findOne(annonceId);
    user.favorites = user.publishedAnnonces.filter(
      (annonce) => annonce.id !== annonceId,
    );
    annonce.favoritedBy = annonce.favoritedBy.filter(
      (user) => user.id !== userId,
    );
  }
  async getAllAvailable(): Promise<Annonce[]> {
    return await this.annonceRepository
      .createQueryBuilder('annonce')
      .where('annonce.state = "available"')
      .getMany();
  }
  async getAllNOTAvailable(): Promise<Annonce[]> {
    return await this.annonceRepository
      .createQueryBuilder('annonce')
      .where('annonce.state = "not-available"')
      .getMany();
  }
  async getAll(): Promise<Annonce[]> {
    return await this.annonceRepository.createQueryBuilder('annonce').getMany();
  }
  async setToNotAvailable(annonceId): Promise<Annonce[]> {
    const annonce = await this.annonceRepository
      .createQueryBuilder()
      .update('annonce')
      .set({ state: AnnonceStateEnum.NOTAVAILABE })
      .where('annonce.id = :id', { id: annonceId })
      .execute();
    console.log(annonce);
    return annonce.raw[0];
  }
}
