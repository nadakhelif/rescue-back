import { Module } from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { AnnonceController } from './annonce.controller';
import { AnimalModule } from '../animal/animal.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Annonce } from './entities/annonce.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Annonce]), AnimalModule, UserModule],
  controllers: [AnnonceController],
  providers: [AnnonceService],
})
export class AnnonceModule {}
