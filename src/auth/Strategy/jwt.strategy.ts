import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user';
import { InjectRepository } from '@nestjs/typeorm';

const SECRET = 'secret';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: SECRET,
    });
  }

  async validate(payload: any) {
    console.log(payload);
    console.log('hiii');
    const { email } = payload;
    console.log('hiii');
    const user = await this.userRepository.findOneBy({ email });
    console.log("user: ",user);
    console.log("ghlattttt");
    if (user) {
      console.log("hiiii")
      const { password, ...result } = user;
      console.log("result :" ,result)
      return result;
    }
    throw new UnauthorizedException('No authentication');
  }
}
