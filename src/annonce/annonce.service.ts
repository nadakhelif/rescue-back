import { Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CrudService } from 'src/common/crud.service';
import { AnnonceEntity } from './entities/annonce';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddAnnonceDto } from './dto/addAnnoncedto';
import { AnimalService } from 'src/animal/animal.service';
import { AnimalEntity } from 'src/animal/entities/animal/animal';
import { Inject } from '@nestjs/common/decorators';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user';
import { AnnonceStateEnum } from 'src/enums/annonceStateEnum';

@Injectable()
export class AnnonceService extends CrudService<AnnonceEntity> {
  @InjectRepository(AnnonceEntity)
  private animalRepository: Repository<AnimalEntity>;
  @InjectRepository(User)
  private userRepository: Repository<User>;
  constructor(
    @InjectRepository(AnnonceEntity)
    private annonceRepository: Repository<AnnonceEntity>,
    @Inject(forwardRef(() => AnimalService))
    private animalService: AnimalService,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => CrudService))
    private crudService: CrudService<AnnonceEntity>,
  ) {
    super(annonceRepository);
  }

  async addAnnonce(addDto: AddAnnonceDto): Promise<Partial<AnnonceEntity>> {
    console.log(addDto);
    if (addDto.animalId) {
      //this.animalService = new AnimalService(this.animalRepository);
      const animalId = await this.animalService.findOne(addDto.animalId);
      console.log(animalId);
      if (!animalId) {
        throw new NotFoundException(
          'There is no animal with the corresponding id',
        );
      }
    }
    const newAnnonce = this.annonceRepository.create(addDto);
    newAnnonce.animal = await this.animalService.findOne(addDto.animalId);
    newAnnonce.user = await this.userService.findOne(addDto.userId);
    return await this.annonceRepository.save(addDto);
  }
  async addToFavoris(annonceId, userId) {
    /*const annonce = await this.annonceRepository
      .createQueryBuilder('annonce')
      .select('*')
      .where('annonce.id = :id', { id: +annonceId });
    console.log(typeof +annonceId);
    console.log(annonce.getQuery());
    console.log(await annonce.getOne());*/
    const annonce = await this.annonceRepository.findOneById(+annonceId);
    console.log(annonce);
    const user = await this.userService.findOne(userId);
    console.log(user);
    //annonce.users.push(user);
    return 'added successfuly';
  }
  async deleteFromFav(annonceId, userId) {
    const user = await this.userService.findOne(userId);
    const annonce = await this.annonceRepository.findOne(annonceId);
    user.annonces = user.annonces.filter((annonce) => annonce.id !== annonceId);
    annonce.users = annonce.users.filter((user) => user.id !== userId);
  }
  async getAllAvailable(): Promise<AnnonceEntity[]> {
    return await this.annonceRepository
      .createQueryBuilder('annonce')
      .where('annonce.state = "available"')
      .getMany();
  }
  async getAllNOTAvailable(): Promise<AnnonceEntity[]> {
    return await this.annonceRepository
      .createQueryBuilder('annonce')
      .where('annonce.state = "not-available"')
      .getMany();
  }
  async getAll(): Promise<AnnonceEntity[]> {
    return await this.annonceRepository.createQueryBuilder('annonce').getMany();
  }
  async setToNotAvailable(annonceId): Promise<AnnonceEntity[]> {
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
