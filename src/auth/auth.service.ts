import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';

import { AuthDto } from './dto/auth.dto';
import { PrismaService } from 'src/prisma.service';
import { User } from '@prisma/client';
import { verify } from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  // register new login
  async register(dto: AuthDto) {
    const oldUser = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (oldUser) throw new BadRequestException('User already registered');

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: faker.name.firstName(),
        avatarPath: faker.image.avatar(),
        phone: faker.phone.number('+996 (###) ##-##-##'),
        password: await hash(dto.password),
      },
    });

    const tokens = await this.issueTokens(user.id);

    return { user: this.returnUserFields(user), ...tokens };
  }

  // get new token
  async getNewToken(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.prisma.user.findUnique({
      where: { id: result.id },
    });

    const tokens = await this.issueTokens(user.id);

    return { user: this.returnUserFields(user), ...tokens };
  }

  // login
  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    const tokens = await this.issueTokens(user.id);

    return { user: this.returnUserFields(user), ...tokens };
  }

  private async issueTokens(userId: number) {
    const data = { id: userId };

    const accesToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accesToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }

  private async validateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const isValid = await verify(user.password, dto.password);
    if (!isValid) throw new UnauthorizedException('Invalid password');

    return user;
  }

  private logger: Logger = new Logger('topContext');
}
