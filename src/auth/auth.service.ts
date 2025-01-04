import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SigninDTO } from './dto/SignInDto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    if (!email || !password) {
      console.log('please provide al the details');
      throw new BadRequestException('please provide al the details');
    }

      let existingUser: User | null = null;;
    try {
      existingUser = await this.userRepository.findOne({ where: { email } });
    } catch (error) {
      console.log('error while fetching User', error);
      throw new Error('error while fetching User');
    }

    if (!existingUser) {
      console.log('No user with this email');
      throw new NotFoundException('No user with this email');
    }

    if (existingUser.password != password) {
      console.log('Invalid credentials, Please Try again');
      throw new UnauthorizedException('Invalid credentials, Please Try again');
    }

    const payload = {
      userId: existingUser.id,
    };
    return {
      message: 'Login successfull',
        access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signup(data: SigninDTO) {
    if (!data) {
      console.log('Please provide all the details');
      throw new BadRequestException('Please provide all details');
    }
    let existingUser: User|null = null;
    try {
      existingUser = await this.userRepository.findOne({
        where: { email: data.email },
      });
    } catch (err) {
      console.log('error while fetching user: ', err);
      throw new Error('error while fetching user');
    }

    if (existingUser) {
      console.log('User with this mail already exists');
      throw new BadRequestException('User with this mail already exists');
    }

    try {
      let newUser = await this.userRepository.save(data);
      console.log('successfully created new user', newUser);
      return newUser;
    } catch (error) {
      console.log('error while saving user', error);
      throw new Error('error while saving user');
    }
  }
}
