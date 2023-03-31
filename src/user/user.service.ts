import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    const user = await this.userRepository.create({
      ...createUserDto,
    });

    user.password = await bcrypt.hash(user.password, 10);
    try {
      await this.userRepository.save(user);
    } catch (e) {
      throw new ConflictException(
        `Le username et le email doivent être unique`,
      );
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
  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
