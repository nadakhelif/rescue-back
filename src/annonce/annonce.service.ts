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
import { User } from '../user/entities/user';
import { AnnonceCategoryEnum } from '../enums/annonceCategoryEnum';
import { AnimalSexeEnum } from '../enums/animalSexeEnum';

@Injectable()
export class AnnonceService extends CrudService<Annonce> {
  constructor(
    @InjectRepository(Annonce)
    private annonceRepository: Repository<Annonce>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
        state: AnnonceStateEnum.AVAILABLE,
        publisher: publisher,
        animal: animalId,
      });
      return await this.annonceRepository.save(newAnnonce);
    }
  }

  async findAll() {
    return await this.annonceRepository.find({ relations: ['publisher'] });
  }
  async paginer(skip: number, limit: number) {
    const take = limit;
    return await this.annonceRepository.find({ skip, take });
  }
  async searchByCriteria(
    minAge: number,
    maxAge: number,
    category: AnnonceCategoryEnum,
    sex: AnimalSexeEnum,
    available: AnnonceStateEnum,
  ) {
    const query = this.annonceRepository.createQueryBuilder('annonce');
    query.innerJoin('annonce.animal', 'animal');

    if (minAge !== undefined) {
      query.where('animal.age >= :minAge', { minAge });
    }

    if (maxAge !== undefined) {
      query.andWhere('animal.age <= :maxAge', { maxAge });
    }

    if (category !== undefined) {
      query.andWhere('annonce.category = :category', { category });
    }

    if (sex !== undefined) {
      query.andWhere('animal.sexe = :sex', { sex });
    }

    if (available !== undefined) {
      query.andWhere('annonce.state = :available', { available });
    }

    return query.getMany();
  }

  async addToFavorites(userId: number, annonceId: number) {
    const user = await this.userService.findOne(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const annonce = await this.annonceRepository.findOne({
      where: { id: annonceId },
    });

    if (!annonce) {
      throw new NotFoundException('Annonce not found');
    }

    // Check if the annonce is already in the favorites array
    const existingFavorite = user.favorites.find(
      (favorite) => favorite.id === annonce.id,
    );

    if (!existingFavorite) {
      user.favorites.push(annonce);
    }

    return await this.userRepository.save(user);
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
  async findAllAvailable(): Promise<Annonce[]> {
    const statusQuery = AnnonceStateEnum.AVAILABLE;
    const annonces = await this.annonceRepository.find({
      where: {
        state: statusQuery,
      },
    });

    return annonces;
  }

  async getAllNOTAvailable(): Promise<Annonce[]> {
    return await this.annonceRepository.find({
      where: {
        state: AnnonceStateEnum.NOTAVAILABE,
      },
    });
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
