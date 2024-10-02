import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  async getProfile(ssp: SearchSortPaginationRequest) {
    if (ssp.page < 1 || ssp.size < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    const query = this.userRepo.createQueryBuilder('users');

    applySearch(query, ssp.keyword, ['users.email']);
    applySort(query, ssp.sortField, ssp.sortOrder);
    applyPagination(query, ssp.page, ssp.size);

    const total = await query.getCount();
    const user = await query.getMany();

    return { message: 'Get profile success', data: { total, user } };
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

    return { message: 'Get profile by id success', data: { user } };
  }
  //#endregion
}
