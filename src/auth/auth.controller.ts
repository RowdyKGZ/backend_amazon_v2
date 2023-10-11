import {
  Controller,
  HttpCode,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // register login method
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('register')
  async register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }

  // login
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  // acces token
  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post('login/acces-token')
  async getNewToken(@Body() dto: RefreshTokenDto) {
    return this.authService.getNewToken(dto.refreshToken);
  }
}
