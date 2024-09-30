import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ChangePasswordRequest {
  @ApiProperty({ type: 'string', example: 'oldpassword' })
  @IsString()
  @IsNotEmpty()
  oldPassword!: string;

  @ApiProperty({ type: 'string', example: 'newpassword' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  newPassword!: string;
}
