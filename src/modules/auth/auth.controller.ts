import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import {
  ChangePasswordRequest,
  RefreshTokenRequest,
  ResetPasswordRequest,
  SignInRequest,
  SignUpRequest,
} from './requests';
import { Auth } from './decorators/auth.decorator';
import { AUTH_TYPE_ENUM, CURRENT_USER, ROLE_ENUM } from 'src/constants';
import { CurrentUser } from './decorators/current-user.decorator';
import { ICurrentUser } from './interfaces';
import { Request } from 'express';
import { AuthResponse } from './response/auth.response';
import { DataResponse } from 'src/system/response';

@Controller('auth')
export class AuthController {
  constructor(
    /**
     * : Inject server
     */

    private readonly authService: AuthService,
  ) {}

  //#region signUp
  //: signUp
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @Auth(AUTH_TYPE_ENUM.None)
  async signUp(@Body() signUpRequest: SignUpRequest, @Req() req: Request) {
    const newUser = await this.authService.signUp(
      signUpRequest,
      req.protocol,
      req.headers,
    );

    return new AuthResponse('Sign up success', newUser);
  }
  //#endregion

  //#region confirmEmail
  //: confirmEmail
  @Get('confirm')
  @HttpCode(HttpStatus.OK)
  @Auth(AUTH_TYPE_ENUM.None)
  async confirmEmail(@Query('token') token: string) {
    return this.authService.confirmEmail(token);
  }
  //#endregion

  //#region signIn
  //: signIn
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @Auth(AUTH_TYPE_ENUM.None)
  async signIn(@Body() signInRequest: SignInRequest) {
    const tokens = await this.authService.signIn(signInRequest);

    return new DataResponse('Sign in success', tokens);
  }
  //#endregion

  //#region refreshToken
  //: refreshToken
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  @Auth(AUTH_TYPE_ENUM.None)
  async refreshToken(@Body() refreshTokenRequest: RefreshTokenRequest) {
    const tokens = await this.authService.refreshTokens(refreshTokenRequest);
    return new DataResponse('Refresh token success', tokens);
  }
  //#endregion

  //#region changePassword
  //: changePassword

  @Put('change-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @Auth(AUTH_TYPE_ENUM.Bearer)
  async changePassword(
    @Body() changePasswordRequest: ChangePasswordRequest,
    @CurrentUser() currentUser: ICurrentUser,
  ) {
    return this.authService.changePassword(changePasswordRequest, currentUser);
  }
  //#endregion

  //#region forgotPassword
  //: forgotPassword
  @Post('forgot-password')
  @Auth(AUTH_TYPE_ENUM.None)
  async forgotPassword(@Body('email') email: string, @Req() req: Request) {
    return this.authService.forgotPassword(email, req.protocol, req.headers);
  }
  //#endregion

  //#region resetPassword
  //: resetPassword
  @Put('reset-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @Auth(AUTH_TYPE_ENUM.None)
  async resetPassword(
    @Body() resetPasswordRequest: ResetPasswordRequest,
    @Query('token') resetToken: string,
  ) {
    return this.authService.resetPassword(resetPasswordRequest, resetToken);
  }
  //#endregion

  //#region logOut
  //: logOut
  @Get('log-out')
  @HttpCode(HttpStatus.OK)
  async logOut(@Req() req: any) {
    return this.authService.logOut(req.session);
  }
  //#endregion

  //#region getMe
  //: logOut
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: any) {
    const profileOfCurUser = await this.authService.getMe(req[CURRENT_USER]);
    return new AuthResponse('Get me success', profileOfCurUser);
  }
  //#endregion

  //#region testRoute
  //: testRoute
  @Get('test-route')
  @Auth(AUTH_TYPE_ENUM.None)
  async testRoute(@CurrentUser() user: ICurrentUser) {
    console.log(user);
    return 'test';
  }
  //#endregion
}
