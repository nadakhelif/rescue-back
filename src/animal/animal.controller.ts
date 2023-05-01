import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { AddAnimalDto } from './dto/addAnimalDto';
import { AnimalService } from './animal.service';
import { UpdateAnimalDto } from './dto/updateAnimalDto';
import { AnimalSexeEnum } from 'src/enums/animalSexeEnum';

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}
  @Post()
  async addAnimal(@Body() addAnimal: AddAnimalDto) {
    return await this.animalService.createEntity(addAnimal);
  }
  @Get()
  async getAll() {
    return await this.animalService.findAll();
  }
  @Get(':id')
  async findOneByid(@Param('id') id) {
    return await this.animalService.findOne(id);
  }
  @Patch(':id')
  async update(@Param('id') id, @Body() updateanimal: UpdateAnimalDto) {
    return await this.animalService.update(+id, updateanimal);
  }
  @Delete(':id')
  async softremove(@Param('id') id) {
    return await this.animalService.softremove(id);
  }
  @Get(':min/:max')
  async filterByAge(@Param('min') min, @Param('max') max) {
    return await this.animalService.filterByage(+min, +max);
  }
  @Get('bysexe/myanimal/:sexe')
  async filterBySexe(@Param('sexe') sexe) {
    return await this.animalService.filterBySexe(sexe);
  }
  @Get('byrace/myanimal/:race')
  async filterByRace(@Param('race') race) {
    return await this.animalService.filterByRace(race);
  }
  @Get('byType/myanimal/:type')
  async filterByType(@Param('type') type) {
    return await this.animalService.filterByType(type);
  }
}
