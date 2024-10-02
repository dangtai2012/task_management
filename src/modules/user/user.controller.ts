import {
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ROLE_ENUM } from 'src/constants';
import { Role } from '../auth/decorators';
import { UserService } from './services/user.service';
import { UserResponseInterceptor } from './response/user-response.interceptor';
import { SearchSortPaginationRequest } from 'src/system/dbs/requests/search-sort-pagination.request';

@Controller('user')
export class UserController {
  constructor(
    /**
     * : Inject server
     */

    private readonly userService: UserService,
  ) {}

  //#region getProfile
  //: getProfile
  @Get('profile')
  @UseInterceptors(UserResponseInterceptor)
  @Role(ROLE_ENUM.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Query() ssp: SearchSortPaginationRequest) {
    return this.userService.getProfile(ssp);
  }
  //#endregion

  //#region getProfileById
  //: getProfileById
  @Get('profile/:userId')
  @UseInterceptors(UserResponseInterceptor)
  @Role(ROLE_ENUM.ADMIN, ROLE_ENUM.USER)
  @HttpCode(HttpStatus.OK)
  async getProfileById(@Param('userId') userId: string) {
    return this.userService.getProfileById(userId);
  }
  //#endregion
}
