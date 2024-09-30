import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimum eight characters, at least one letter, one number and one special character',
  })
  newPassword!: string;
}
