import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { CreateAnnonceDto } from './dto/create-annonce.dto';
import { UpdateAnnonceDto } from './dto/update-annonce.dto';

@Controller('annonce')
export class AnnonceController {
  constructor(private readonly annonceService: AnnonceService) {}

  @Post()
  create(@Body() createAnnonceDto: CreateAnnonceDto) {
    return this.annonceService.create(createAnnonceDto);
  }
  @Post('fav/:userId/:annonceId')
  async addFavorite(
    @Param('userId') userId: number,
    @Param('annonceId') annonceId: number,
  ) {
    console.log(userId, annonceId);
    return this.annonceService.addToFavorites(userId, annonceId);
  }

  @Get()
  findAll() {
    return this.annonceService.findAll();
  }
  @Get('page')
  async paginer(@Query() params) {
    console.log(params);
    const { page, limit } = params;
    const skip = (page - 1) * limit;
    return await this.annonceService.paginer(skip, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.annonceService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnnonceDto: UpdateAnnonceDto) {
    return this.annonceService.update(+id, updateAnnonceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.annonceService.softremove(+id);
  }
  @Get('/available/yey')
  async getAllAvailable() {
    return this.annonceService.findAllAvailable();
  }
  @Get('/not/not')
  async getAllNotAvailable() {
    return this.annonceService.getAllNOTAvailable();
  }
  @Patch('not/:id')
  async updateState(@Param('id') id) {
    return await this.annonceService.setToNotAvailable(id);
  }
}
