import { IsEmail, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @MinLength(8, {
    message: 'Password must be at least 8 characters',
  })
  password: string;
}
