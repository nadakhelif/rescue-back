import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { of } from 'rxjs';
import { JwtAuthGuard } from './guard/jwt.auth.guards';

export const storage = {
  storage: diskStorage({
    destination: './uploads/profileimages',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }

  @Post(':id/profile-photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadProfilePhoto(
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userService.uploadProfilePic(id, file);
  }

  @Get('profile-image/:imagename')
  // @UseGuards(JwtAuthGuard)
  findProfileImage(@Param('imagename') imagename, @Res() res) {
    return of(
      res.sendFile(join(process.cwd(), 'uploads/profileimages/' + imagename)),
    );
  }

  @Get()
  async findAll() {
    return this.userService.findAll2();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Get('email/:email')
  findOneByEmail(@Param('email') email: string) {
    return this.userService.getByEmail(email);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update1(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.softremove(+id);
  }

  @Get('fav/:id')
  @UseGuards(JwtAuthGuard)
  async getAllfav(@Param('id') id: number) {
    return this.userService.getAllFav(id);
  }
  @Get(':id/published-announcements')
  getAllPublishedAnnouncementsByUser(@Param('id') id: string) {
    return this.userService.getAllPublishedAnnouncementsByUser(id);
  }
}
