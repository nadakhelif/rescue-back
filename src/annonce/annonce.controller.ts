import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { AddAnnonceDto } from './dto/addAnnoncedto';
import { JwtAuthGuard } from 'src/user/Guards/jwt.auth.guards';
import { Request } from 'express';

@Controller('annonce')
export class AnnonceController {
  constructor(private readonly annonceService: AnnonceService) {}
  @Get('available')
  async getAllAvailable() {
    return await this.annonceService.getAllAvailable();
  }
  @Get('notavailable')
  async getAllNotAvailable() {
    return await this.annonceService.getAllNOTAvailable();
  }
  @Get()
  async getAll() {
    return await this.annonceService.getAll();
  }
  @Post()
  async addAnnonce(@Body() addDto: AddAnnonceDto) {
    return await this.annonceService.addAnnonce(addDto);
  }
  @Delete(':id')
  async deleteAnnonce(@Param('id') id: number) {
    return await this.annonceService.softremove(id);
  }
  @Post(':userId/:annonceId')
  async addToFav(@Param('userId') userId, @Param('annonceId') annonceId) {
    return await this.annonceService.addToFavoris(annonceId, userId);
  }
  @Patch(':id')
  async updateState(@Param('id') id) {
    return await this.annonceService.setToNotAvailable(id);
  }
  @Get('ById/:id')
  async getById(@Param('id') id) {
    return this.annonceService.findOne(id);
  }
}
