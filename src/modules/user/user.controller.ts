import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ROLE_ENUM } from 'src/constants';
import { Role } from '../auth/decorators';
import { UserService } from './services/user.service';
import { SearchSortPaginationRequest } from 'src/system/dbs/requests/search-sort-pagination.request';
import { UserPaginatedResponse, UserResponse } from './response/user.response';

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
  @Role(ROLE_ENUM.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getProfile(@Query() sspRequest: SearchSortPaginationRequest) {
    const users = await this.userService.getProfile(sspRequest);
    return new UserPaginatedResponse(
      users,
      users.length,
      sspRequest.page,
      sspRequest.size,
      'Get profile success',
    );
  }
  //#endregion

  //#region getProfileById
  //: getProfileById
  @Get('profile/:userId')
  @Role(ROLE_ENUM.ADMIN)
  @HttpCode(HttpStatus.OK)
  async getProfileById(@Param('userId') userId: string) {
    const user = await this.userService.getProfileById(userId);
    return new UserResponse('Get profile success', user);
  }
  //#endregion

  //#region updateStatusAccount
  //: updateStatusAccount
  @Patch('status/:userId')
  @Role(ROLE_ENUM.ADMIN)
  @HttpCode(HttpStatus.ACCEPTED)
  async updateStatusAccount(
    @Body('status') status: boolean,
    @Param('userId') userId: string,
  ) {
    return this.userService.updateStatusAccount(status, userId);
  }
  //#endregion

  //#region updateRole
  //: updateRole
  @Patch('role/:userId')
  @Role(ROLE_ENUM.ADMIN)
  @HttpCode(HttpStatus.ACCEPTED)
  async updateRole(
    @Body('role') role: ROLE_ENUM,
    @Param('userId') userId: string,
  ) {
    return this.userService.updateRole(role, userId);
  }
  //#endregion
}
