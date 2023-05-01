/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User } from './entities/user';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /*@Get('this/get/fortest/:id')
  async getForTest(@Param('id') id: string) {
    return await this.userService.getUserById(+id);
  }*/
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Get()
  async findall(): Promise<User[]> {
    return await this.userService.getAll();
  }
  /*@Get()
  findAll() {
    return this.userService.findAll();
  }*/

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.softremove(+id);
  }
  //@Get('fav/:id')
  //async getAllfav(@Param('id') id: number) {
  //console.log(id);
  //return this.userService.getAllFav(id);
  //}
}
