import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoriesEntity } from 'src/dbs/entities/categories.enitity';
import { Repository } from 'typeorm';
import { CategoryRequest } from '../requests/category.request';
import { Slugify } from 'src/system/utils/slugify';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/dbs/entities';
import { SearchSortPaginationRequest } from 'src/system/dbs/requests/search-sort-pagination.request';
import { applyPagination, applySearch, applySort } from 'src/system';
import { ROLE_ENUM } from 'src/constants';

@Injectable()
export class CategoryService {
  constructor(
    /**
     * : Inject repository
     */

    @InjectRepository(CategoriesEntity)
    private readonly categoryRepo: Repository<CategoriesEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
  ) {}

  //#region createCategory
  //: createCategory
  async createCategory(categoryRequest: CategoryRequest, curUser: any) {
    // Check user
    const user = await this.userRepo.findOne({
      where: {
        id: curUser.sub,
      },
      select: ['id'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    //Check existing category
    const existingCategory = await this.categoryRepo.findOne({
      where: {
        name: categoryRequest.name,
        user_id: user.id,
      },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${categoryRequest.name}" already exists for this user`,
      );
    }

    // Create new category
    const cateSlug = Slugify(categoryRequest.name);
    const newCate = await this.categoryRepo.save(
      this.categoryRepo.create({
        name: categoryRequest.name,
        slug: cateSlug,
        user_id: user.id,
      }),
    );

    return { message: 'Create category success', data: newCate };
  }
  //#endregion

  //#region getCategory
  //: getCategory
  async getCategory(sspRequest: SearchSortPaginationRequest, curUser: any) {
    const query = this.categoryRepo
      .createQueryBuilder('categories')
      .innerJoin('categories.user_of_category', 'category_of_user')
      .addSelect([
        'category_of_user.id',
        'category_of_user.first_name',
        'category_of_user.last_name',
        'category_of_user.email',
        'category_of_user.role',
      ])
      .leftJoinAndSelect('categories.tasks', 'category_of_task')
      .orderBy('categories.created_at', 'ASC')
      .orderBy('categories.user_id', 'ASC');

    if (curUser.role === ROLE_ENUM.USER) {
      query.where('categories.user_id = :userId', { userId: curUser.sub });
    }

    applySearch(query, sspRequest.keyword, ['categories.slug']);
    applySort(query, sspRequest.sortField, sspRequest.sortOrder);
    applyPagination(query, sspRequest.page, sspRequest.size);

    const total = await query.getCount();
    const categories = await query.getMany();

    return { message: 'Get categories success', categories, total };
  }
  //#endregion

  //#region getCategoryById
  //: getCategoryById
  async getCategoryById(categoryId: string) {
    const category = await this.categoryRepo.findOne({
      where: {
        id: categoryId,
      },
      select: ['id', 'name', 'slug', 'user_id'],
    });

    return category;
  }
  //#endregion

  //#region updateCategory
  //: updateCategory
  async updateCategory(
    categoryRequest: CategoryRequest,
    categoryId: string,
    curUser: any,
  ) {
    const category = await this.categoryRepo.findOne({
      where: {
        id: categoryId,
        user_id: curUser.sub,
      },
      select: ['id'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const slugCate = Slugify(categoryRequest.name);

    const existingCategory = await this.categoryRepo.findOne({
      where: {
        slug: slugCate,
        user_id: curUser.sub,
      },
    });

    if (existingCategory) {
      throw new ConflictException(
        `Category with name "${categoryRequest.name}" already exists for this user`,
      );
    }

    // const updateCate = await this.categoryRepo.save({
    //   ...category,
    //   name: categoryRequest.name,
    //   slug: slugCate,
    // });

    await this.categoryRepo.update(category.id, {
      name: categoryRequest.name,
      slug: slugCate,
    });

    const updateCate = await this.categoryRepo.findOne({
      where: {
        id: category.id,
      },
      select: ['id', 'name'],
    });

    return {
      message: 'Update category success',
      data: updateCate,
    };
  }
  //#endregion

  //#region deleteCategory
  //: deleteCategory
  async deleteCategory(categoryId: string, curUser: any) {
    const existingCategory = await this.categoryRepo.findOne({
      where: {
        id: categoryId,
        user_id: curUser.sub,
      },
    });

    if (!existingCategory) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryRepo.delete(existingCategory.id);

    return { message: `Delete category success` };
  }
  //#endregion
}
