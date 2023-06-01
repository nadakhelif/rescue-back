import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { AnimalService } from './animal.service';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { of } from 'rxjs';
import { JwtAuthGuard } from '../user/guard/jwt.auth.guards';
export const storage = {
  storage: diskStorage({
    destination: './uploads/animalImages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('animal')
export class AnimalController {
  constructor(private readonly animalService: AnimalService) {}

  @Post()
  create(@Body() createAnimalDto: CreateAnimalDto) {
    return this.animalService.create(createAnimalDto);
  }
  @Post(':id/uploadImage')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadProfilePhoto(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.animalService.uploadAnimalPic(id, file);
    // console.log(req);
    // console.log(createAnimalDto);
    // console.log(typeof createAnimalDto.file === 'string');
    // createAnimalDto = JSON.parse(createAnimalDto) as CreateAnimalDto;
    // return this.animalService.createAnimalWithImage(createAnimalDto, file);
  }

  @Get()
  findAll() {
    return this.animalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.animalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnimalDto: UpdateAnimalDto) {
    return this.animalService.update(+id, updateAnimalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animalService.softremove(+id);
  }
}
