import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO } from './dto/LoginDto';
import { SigninDTO } from './dto/SignInDto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'User login' }) // Describes the operation
  @ApiResponse({ status: 200, description: 'Successfully logged in.' }) // Success response
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  login(@Body() loginDto: LoginDTO) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

  @Post('signup')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: 'User signup' }) // Describes the operation
  @ApiResponse({ status: 201, description: 'User successfully registered.' }) // Success response
  @ApiResponse({
    status: 400,
    description: 'Bad request (e.g. missing or invalid fields).',
  })
  singup(@Body() singinDto: SigninDTO) {
    return this.authService.signup(singinDto);
  }
}
