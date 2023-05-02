import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { CrudService } from '../common/crud.service';
import { PasswordReset } from '../auth/entities/passwordReset.entity';
import { randomBytes } from 'crypto';
import { EmailService } from '../email/email.service';

import { Express } from 'express';

@Injectable()
export class UserService extends CrudService<User> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private passWordRestRepository: Repository<PasswordReset>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.userRepository.create({
      ...createUserDto,
    });
    user.verificationToken = randomBytes(20).toString('hex');
    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw e;
    }
    try {
      await this.emailService.sendVerificationEmail(
        user.email,
        user.id,
        user.verificationToken,
      );
    } catch (e) {
      throw e;
    }
    return {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
    };
  }
  async login(credentials: LoginUserDto) {
    // Récupére le login et le mot de passe
    const { email, password } = credentials;
    // On peut se logger ou via le username ou le password
    // Vérifier est ce qu'il y a un user avec ce login ou ce mdp
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
    //console.log(user);
    // Si not user je déclenche une erreur

    if (!user) throw new NotFoundException('email ou password erronée');
    // Si oui je vérifie est ce que le mot est correct ou pas
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      const payload = {
        email: user.email,
      };
      const jwt = await this.jwtService.sign(payload);
      return {
        access_token: jwt,
      };
    } else {
      // Si mot de passe incorrect je déclenche une erreur
      throw new NotFoundException('username ou password erronée');
    }
  }
  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('id erronée');
    } else {
      if (updateUserDto.password) {
        const saltOrRounds = 10;
        updateUserDto.password = await bcrypt.hash(
          updateUserDto.password,
          saltOrRounds,
        );
      }
    }
    await this.userRepository.update({ id }, updateUserDto);
    return user;
  }
  async changeVerifyToTrue(id: number) {
    try {
      const user = await this.userRepository.findOne({ where: { id: id } });
      user.verified = true;

      await this.userRepository.save(user);
      return user;
    } catch (e) {
      throw new ConflictException(`couldn't update verify the id`);
    }
  }
  async getByEmail(email: string): Promise<any> {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }
  async createPasswordResetToken(id: number) {
    try {
      const passwordReset = new PasswordReset();
      passwordReset.userId = id;
      passwordReset.token = randomBytes(20).toString('hex');
      const savedToken = await this.passWordRestRepository.save(passwordReset);
      return savedToken;
    } catch (error) {
      throw error;
    }
  }
  async verifyPasswordResetToken(userId: number, token: string) {
    const foundToken = await this.passWordRestRepository.findOne({
      where: { token: token, userId: userId },
    });
    return foundToken;
  }

  async deletePasswordResetToken(token: string) {
    const deletedToken = await this.passWordRestRepository.findOne({
      where: { token: token },
    });
    try {
      await this.passWordRestRepository.delete(deletedToken.id);
    } catch (e) {
      throw e;
    }
    return { message: 'password reset deleted nice !' };
  }

  async changePassword(id: number, password: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.password = await bcrypt.hash(password, 10);
    await this.userRepository.save(user);
  }
  async uploadProfilePic(id: number, file: Express.Multer.File) {
    const user = await this.userRepository.findOne({ where: { id: id } });
    if (!user) {
      throw new Error(`User with id ${id} not found`);
    }
    user.profilePhoto = `/uploads/profileimages/${file.filename}`;
    return await this.userRepository.save(user);
  }

  async getAllFav(id) {
    const user = this.userRepository.findOne({ where: { id: id } });
    console.log(user);
    console.log((await user).favorites);
    return (await user).favorites;
  }
  async findOne(id) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['favorites'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    return user;
  }
}
