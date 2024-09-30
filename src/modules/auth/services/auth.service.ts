import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionEntity, UserEntity } from 'src/dbs/entities';
import { MoreThan, Repository } from 'typeorm';
import { SignUpRequest } from '../requests/sign-up.request';
import { compare, generateRandomCode, hashPassword } from '../utils';
import { JwtProvider } from './jwt.provider';
import { MailProvider } from './mail.provider';
import { JwtService, TokenExpiredError } from '@nestjs/jwt';
import { SignInRequest } from '../requests/sign-in.request';
import {
  ChangePasswordRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
} from '../requests';
import { ICurrentUser } from '../interfaces';
import { PasswordResetEntity } from 'src/dbs/entities/password-reset.entity';

@Injectable()
export class AuthService {
  constructor(
    /**
     * : Inject repository
     */

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,

    @InjectRepository(PasswordResetEntity)
    private readonly passwordResetRepo: Repository<PasswordResetEntity>,

    /**
     * : Inject service, provider
     */

    //: Provider
    private readonly jwtProvider: JwtProvider,
    private readonly mailProvider: MailProvider,

    //: Service
    private readonly jwtService: JwtService,
  ) {}

  //#region signUp
  //: signUp
  async signUp(signUpRequest: SignUpRequest) {
    // Check if user exists
    if (
      await this.userRepo.exists({
        where: { email: signUpRequest.email },
      })
    ) {
      throw new BadRequestException({
        message: 'This account already exists',
      });
    }

    // Create new user
    const newUser = await this.userRepo.save(
      this.userRepo.create({
        first_name: signUpRequest.firstName,
        last_name: signUpRequest.lastName,
        email: signUpRequest.email,
        password: await hashPassword(signUpRequest.password),
      }),
    );

    // Generate token and send mail
    const token = await this.jwtProvider.signToken(newUser.id, 300);

    // Send email verify
    const url = `http://localhost:3000/auth/confirm?token=${token}`;
    const subject = 'Account Verification';
    await this.mailProvider.sendEmail(url, newUser.email, subject, token);

    return newUser;
  }
  //#endregion

  //#region confirmEmail
  //: confirmEmail
  async confirmEmail(token: string) {
    try {
      const payload = await this.jwtProvider.verify(token);

      const user = await this.userRepo.findOneBy({
        id: payload.sub,
        is_active: false,
      });

      if (!user) {
        throw new NotFoundException('No account found for email confirmation.');
      }

      user.is_active = true;
      await this.userRepo.save(user);

      return { message: 'Email confirmed successfully' };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const payload = await this.jwtService.decode(token);

        const user = await this.userRepo.findOneBy({
          id: payload.sub,
          is_active: false,
        });

        if (user) {
          await this.userRepo.delete(user.id);
        }

        throw new UnauthorizedException(
          'Token has expired, account has been removed.',
        );
      }

      throw new UnauthorizedException('Invalid token.');
    }
  }
  //#endregion

  //#region signIn
  //: signIn
  async signIn(signInRequest: SignInRequest) {
    // Find the user using email ID
    // Throw an exception user not found
    const user = await this.userRepo.findOneBy({
      email: signInRequest.email,
    });

    if (!user) {
      throw new UnauthorizedException('Account does not exist');
    }

    if (user.is_active === false) {
      throw new UnauthorizedException(
        'The account has not been verified. Please check your email',
      );
    }

    // Compare password to the hash
    const isEqual: boolean = await compare(
      signInRequest.password,
      user.password,
    );

    if (!isEqual) {
      throw new UnauthorizedException('Incorrect password');
    }

    const tokens = await this.jwtProvider.generateATAndRT(user);

    await this.sessionRepo.insert({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken,
      user_id: user,
    });

    return tokens;
  }
  //#endregion

  //#region refreshToken
  //: refreshToken
  async refreshTokens(refreshTokenRequest: RefreshTokenRequest) {
    try {
      // Verify the refresh token using jwtService
      const { sub } = await this.jwtProvider.verify(
        refreshTokenRequest.refreshToken,
      );

      // Fetch user from the database
      const user = await this.userRepo.findOneBy({
        id: sub,
        is_active: true,
      });

      // Generate the tokens
      const tokens = await this.jwtProvider.generateATAndRT(user);

      // Update session
      await this.sessionRepo.update(
        {
          refresh_token: refreshTokenRequest.refreshToken,
        },
        {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        },
      );

      return tokens;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
  //#endregion

  //#region changePassword
  //: changePassword
  async changePassword(
    changePasswordRequest: ChangePasswordRequest,
    current: ICurrentUser,
  ) {
    // Find the user
    const user = await this.userRepo.findOneBy({
      id: current.sub,
      is_active: true,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Compare the old password with the password in DB
    const passwordMatch = await compare(
      changePasswordRequest.oldPassword,
      user.password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('The old password is incorrect');
    }

    // Change user's password
    await this.userRepo.save(
      this.userRepo.create({
        ...user,
        password: await hashPassword(changePasswordRequest.newPassword),
      }),
    );

    return { message: 'Change password successfully' };
  }
  //#endregion

  //#region forgotPassword
  //: forgotPassword
  async forgotPassword(email: string) {
    // Check if user exists
    const user = await this.userRepo.findOneBy({
      email: email,
      is_active: true,
    });

    if (!user) {
      throw new NotFoundException('User not found with this email.');
    }

    // Generate token and send mail
    const token = generateRandomCode();
    const expiresAt = new Date(Date.now() + 300 * 1000);

    // Create record password_reset
    await this.passwordResetRepo.save(
      this.passwordResetRepo.create({
        token: token,
        expires_at: expiresAt,
        user_id: user,
      }),
    );

    // Send email password_reset
    const url = `http://localhost:3000/auth/reset-password?token=${token}`;
    const subject = 'Password Reset';
    await this.mailProvider.sendEmail(url, email, subject, token);

    return { message: 'Reset password email sent' };
  }
  //#endregion

  //#region resetPassword
  //: resetPassword
  async resetPassword(
    resetPasswordRequest: ResetPasswordRequest,
    resetToken: string,
  ) {
    // Find a valid reset token
    const token = await this.passwordResetRepo.findOne({
      where: {
        token: resetToken,
        expires_at: MoreThan(new Date()),
      },
    });

    if (!token) {
      throw new UnauthorizedException('Invalid link');
    }

    // Change user's password
    const user = await this.userRepo.findOneBy({
      password_resets: token.user_id,
      is_active: true,
    });

    if (!user) {
      throw new InternalServerErrorException();
    }

    await this.userRepo.save(
      this.userRepo.create({
        ...user,
        password: await hashPassword(resetPasswordRequest.newPassword),
      }),
    );

    await this.passwordResetRepo.delete({ id: token.id });

    return { message: 'Reset password successfully' };
  }
  //#endregion

  //#region logOut
  //: logOut
  async logOut(session: any) {
    await this.sessionRepo.update(session.id, {
      logout_at: new Date(),
    });
  }
  //#endregion

  //#region Others
  getSessionByToken(accessToken: string) {
    return this.sessionRepo.findOne({ where: { access_token: accessToken } });
  }
  //#endregion
}
