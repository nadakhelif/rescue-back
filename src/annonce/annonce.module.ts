import { Module } from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { AnnonceController } from './annonce.controller';
import { AnimalModule } from '../animal/animal.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Annonce } from './entities/annonce.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Annonce]), AnimalModule],
  controllers: [AnnonceController],
  providers: [AnnonceService],
})
export class AnnonceModule {}
