import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class SigninDTO {
  @ApiProperty({ description: "User's name" })
  @IsNotEmpty()
  @IsString()
  name: string;
  @ApiProperty({ description: 'User email address' })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
