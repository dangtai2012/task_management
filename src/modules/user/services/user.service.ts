import {
  BadRequestException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ROLE_ENUM } from 'src/constants';
import { UserEntity } from 'src/dbs/entities';
import { applyPagination, applySearch, applySort } from 'src/system';
import { SearchSortPaginationRequest } from 'src/system/dbs/requests/search-sort-pagination.request';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    /**
     * : Inject repository
     */

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  //#region getProfile
  //: getProfile
  async getProfile(sspRequest: SearchSortPaginationRequest) {
    if (sspRequest.page < 1 || sspRequest.size < 1) {
      throw new BadRequestException('Page and size must be greater than 0');
    }

    const query = this.userRepo.createQueryBuilder('users');

    applySearch(query, sspRequest.keyword, ['users.email']);
    applySort(query, sspRequest.sortField, sspRequest.sortOrder);
    applyPagination(query, sspRequest.page, sspRequest.size);

    const users = await query.getMany();

    return users;
  }
  //#endregion

  //#region getProfileById
  //: getProfileById
  async getProfileById(userId: string) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'first_name', 'last_name', 'email', 'role'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return user;
  }
  //#endregion

  //#region updateStatusAccount
  //: updateStatusAccount
  async updateStatusAccount(status: boolean, userId: string) {
    const user = this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'is_active'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateStatusAccount = await this.userRepo.update(userId, {
      is_active: status,
    });

    if (updateStatusAccount.affected === 0) {
      throw new NotImplementedException('Update status account fail');
    }

    return {
      status: 'success',
      message:
        status === true ? 'Active account success' : 'Disable account success',
    };
  }
  //#endregion

  //#region updateRole
  //: updateRole
  async updateRole(role: ROLE_ENUM, userId: string) {
    const user = this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'role'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateRole = await this.userRepo.update(userId, {
      role: role,
    });

    if (updateRole.affected === 0) {
      throw new NotImplementedException('Update role fail');
    }

    return {
      status: 'success',
      message: 'Update role success',
    };
  }
  //#endregion
}
