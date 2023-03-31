import { Repository, UpdateResult } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { HasIdInterface } from './hasId.interface';

export class CrudService<Entity extends HasIdInterface> {
  constructor(private repository: Repository<Entity>) {}
  async create(createDto): Promise<Entity> {
    return await this.repository.save(createDto);
  }

  findAll(): Promise<Entity[]> {
    return this.repository.find();
  }

  async findOne(id): Promise<Entity> {
    const Entity = await this.repository.findOne({ where: { id } });
    if (!Entity) {
      throw new NotFoundException();
    }
    return Entity;
  }

  async update(id, updateDto) {
    const Entity = await this.repository.preload({ id, ...updateDto });
    if (!Entity) {
      throw new NotFoundException();
    }
    return this.repository.save(Entity);
  }

  async remove(id): Promise<{ deleted: boolean }> {
    const result = await this.repository.delete({ id });
    if (!result.affected) {
      throw new NotFoundException();
    }
    return { deleted: true };
  }
}
