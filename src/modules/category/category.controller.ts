import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { CategoryService } from './services/category.service';
import { CategoryRequest } from './requests/category.request';
import { Auth, Role } from '../auth/decorators';
import { AUTH_TYPE_ENUM, CURRENT_USER, ROLE_ENUM } from 'src/constants';
import { SearchSortPaginationRequest } from 'src/system/dbs/requests/search-sort-pagination.request';
import {
  CategoryPaginatedResponse,
  CategoryResponse,
} from './response/category.response';

@Controller('categories')
export class CategoryController {
  constructor(
    /**
     * : Inject service
     */

    private readonly categoryService: CategoryService,
  ) {}

  //#region createCategory
  //: createCategory
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Role(ROLE_ENUM.ADMIN, ROLE_ENUM.USER)
  @Auth(AUTH_TYPE_ENUM.Bearer)
  async createCategory(
    @Body() createCategoryRequest: CategoryRequest,
    @Req() req: Request,
  ) {
    const { message, data } = await this.categoryService.createCategory(
      createCategoryRequest,
      req[CURRENT_USER],
    );

    return new CategoryResponse(message, data);
  }
  //#endregion

  //#region getCategory
  //: getCategory
  @Get()
  @HttpCode(HttpStatus.OK)
  async getCategory(
    @Query() sspRequest: SearchSortPaginationRequest,
    @Req() req: Request,
  ) {
    const { message, categories, total } =
      await this.categoryService.getCategory(sspRequest, req[CURRENT_USER]);

    return new CategoryPaginatedResponse(
      categories,
      total,
      sspRequest.page,
      sspRequest.size,
      message,
    );
  }
  //#endregion

  //#region getCategoryById
  //: getCategoryById
  @Get('/:categoryId')
  @HttpCode(HttpStatus.OK)
  async getCategoryById(@Query('categoryId') categoryId: string) {
    const category = await this.categoryService.getCategoryById(categoryId);

    return new CategoryResponse('Get category success', category);
  }
  //#endregion

  //#region updateCategory
  //: updateCategory
  @Patch('/:categoryId')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateCategory(
    @Body() categoryRequest: CategoryRequest,
    @Param('categoryId') categoryId: string,
    @Req() req: Request,
  ) {
    const { message, data } = await this.categoryService.updateCategory(
      categoryRequest,
      categoryId,
      req[CURRENT_USER],
    );
    return new CategoryResponse(message, data);
  }
  //#endregion

  //#region deleteCategory
  //: deleteCategory
  @Delete('/:categoryId')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteCategory(
    @Param('categoryId') categoryId: string,
    @Req() req: Request,
  ) {
    const { message } = await this.categoryService.deleteCategory(
      categoryId,
      req[CURRENT_USER],
    );

    return new CategoryResponse(message);
  }
  //#endregion
}
