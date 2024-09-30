import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignInRequest {
  @ApiProperty({ type: 'string', example: 'admin' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ type: 'string', example: '12345' })
  @IsString()
  @IsNotEmpty()
  password!: string;
}
