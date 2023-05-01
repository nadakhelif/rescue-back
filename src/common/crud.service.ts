/* eslint-disable prettier/prettier */
import { Repository } from 'typeorm';
import { Inject, NotFoundException, forwardRef } from '@nestjs/common';
import { HasIdInterface } from './hasId.interface';
import { AnnonceService } from 'src/annonce/annonce.service';
import { type } from 'os';

export class CrudService<Entity extends HasIdInterface> {
  constructor(private repository: Repository<Entity>) {}
  async createEntity(entitydto): Promise<Entity> {
    return await this.repository.save(entitydto);
  }
  async findAll(): Promise<Entity[]> {
    return await this.repository.find();
  }

  async findOne(id: number): Promise<Entity> {
    console.log(id);
    const Entity = await this.repository.findOneById(id);
    if (!Entity) {
      throw new NotFoundException();
    }
    return Entity;
  }

  async update(id, updateDto) {
    const Entity = await this.repository.preload({ id, ...updateDto });
    console.log(Entity);
    if (!Entity) {
      throw new NotFoundException('cette entité n existe pas');
    }
    return await this.repository.save(Entity);
  }

  async softremove(id) {
    console.log('my id', id, 'of type', typeof +id);
    const Entity = await this.repository.findOneById(+id);
    if (!Entity) {
      throw new NotFoundException('the corresponding id does not exist');
    }
    return await this.repository.softRemove(Entity);
  }
}
