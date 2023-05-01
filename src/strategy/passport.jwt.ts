/* eslint-disable prettier/prettier */
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user';
export interface PayloadInterface {
  email: string;
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      //identifie la façon avec laquelle passportva géreer les requetes qui vont venir
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //va recuperer le token jwt de la requete en utilisant la methode extractjwt
      ignoreExpiration: false, //est ce que tu veux que je vérifie la date d'expiration ou pas
      secretOrKey: configService.get('SECRET'),
    });
  }
  async validate(payload: PayloadInterface) {
    console.log(payload);
    const user = await this.userRepository.findOneBy({
      email: payload.email,
    });
    // si le user existe je le retourne et la automatiquement ce que je retourne dans validate est mis dans le request
    if (user) {
      const { password, ...result } = user;
      return result;
    } else {
      throw new UnauthorizedException();
    }
  }
}
