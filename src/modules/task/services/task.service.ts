import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/dbs/entities/tasks.entity';
import { Repository } from 'typeorm';
import { CreateTaskRequest } from '../requests/create-task.request';
import { CategoriesEntity } from 'src/dbs/entities/categories.enitity';
import { UserEntity } from 'src/dbs/entities';
import { Slugify } from 'src/system/utils/slugify';
import { CategoryService } from 'src/modules/category/services/category.service';
import { UserService } from 'src/modules/user/services/user.service';
import { SearchSortPaginationRequest } from 'src/system/dbs/requests/search-sort-pagination.request';
import { ROLE_ENUM } from 'src/constants';
import {
  applyFilter,
  applyPagination,
  applySearch,
  applySort,
  dayOfMonth,
  dayOfWeek,
} from 'src/system';
import { UpdateTaskRequest } from '../requests/update-task.request';
import { TaskQueryBuilderProvider } from './task-query-builder.provider';
import { GetReportTaskRequest } from '../requests/get-report-task.request';
import * as XLSX from 'xlsx';

@Injectable()
export class TaskService {
  constructor(
    /**
     * : Inject repository
     */
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,

    @InjectRepository(CategoriesEntity)
    private readonly cateRepo: Repository<CategoriesEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,

    /**
     * : Inject service, provider
     */

    //: Service
    private readonly cateService: CategoryService,
    private readonly userService: UserService,

    //: Provider
    private readonly taskQueryBuilderProvider: TaskQueryBuilderProvider,
  ) {}

  //#region createTask
  //: createTask
  async createTask(createTaskRequest: CreateTaskRequest, curUser: any) {
    const [existCate, existUser] = await Promise.all([
      this.cateService.getCategoryById(createTaskRequest.category_id),

      this.userService.getProfileById(curUser.sub),
    ]);

    if (!existCate) {
      throw new NotFoundException('Category not found');
    }

    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    if (curUser.role === 'user') {
      if (curUser.sub !== existCate.user_id) {
        throw new ForbiddenException(
          'You do not have permission to create a task in this category',
        );
      }
    }

    if (createTaskRequest.end_date < createTaskRequest.start_date) {
      throw new BadRequestException(
        'End date cannot be earlier than start date',
      );
    }

    const newTask = await this.taskRepo.save(
      this.taskRepo.create({
        ...createTaskRequest,
        user_id: existCate.user_id,
        category_id: createTaskRequest.category_id,
        slug: Slugify(createTaskRequest.name),
        status_date: createTaskRequest.start_date,
        created_by: curUser.sub,
      }),
    );

    if (!newTask) {
      throw new BadRequestException('Create new task fail');
    }

    const task = await this.taskQueryBuilderProvider
      .taskQueryBuilder()
      .where('tasks.id = :taskId', { taskId: newTask.id })
      .getOne();

    return task;
  }
  //#endregion

  //#region getTask
  //: getTask
  async getTask(sspRequest: SearchSortPaginationRequest, curUser: any) {
    const query = this.taskQueryBuilderProvider.taskQueryBuilder();

    if (curUser.role === ROLE_ENUM.USER) {
      query.where('tasks.user_id = :userId', { userId: curUser.sub });
    }

    applyPagination(query, sspRequest.page, sspRequest.size);

    const tasks = await query.getMany();
    return tasks;
  }
  //#endregion

  //#region getTaskById
  //: getTaskById
  async getTaskById(taskId: string, curUser: any) {
    const task = await this.taskQueryBuilderProvider
      .taskQueryBuilder()
      .where('tasks.id = :taskId', { taskId })
      .andWhere('tasks.user_id = :userId', { userId: curUser.sub })
      .getOne();

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
  //#endregion

  //#region updateTask
  //: updateTask
  async updateTask(
    updateTaskRequest: UpdateTaskRequest,
    taskId: string,
    curUser: any,
  ) {
    const [existTask, existCate, existUser] = await Promise.all([
      this.taskRepo.findOne({
        where: {
          id: taskId,
        },
      }),
      this.cateService.getCategoryById(updateTaskRequest.category_id),

      this.userService.getProfileById(curUser.sub),
    ]);

    if (!existTask) {
      throw new NotFoundException('Task not found');
    }

    if (!existCate) {
      throw new NotFoundException('Category not found');
    }

    if (!existUser) {
      throw new NotFoundException('User not found');
    }

    if (curUser.role === 'user') {
      if (curUser.sub !== existTask.user_id) {
        throw new ForbiddenException(
          'You do not have permission to create a task in this category',
        );
      }
    }

    if (updateTaskRequest.start_date > existTask.end_date) {
      throw new BadRequestException(
        'The start date cannot be later than the end date',
      );
    }

    if (updateTaskRequest.start_date > existTask.status_date) {
      throw new BadRequestException(
        'The start date cannot be later than the status date',
      );
    }

    if (updateTaskRequest.end_date < existTask.start_date) {
      throw new BadRequestException(
        'The end date cannot be earlier than the start date',
      );
    }

    await this.taskRepo.update(taskId, {
      ...updateTaskRequest,
      slug: Slugify(updateTaskRequest.name),
      updated_by: curUser.sub,
      status_date: updateTaskRequest.status
        ? new Date()
        : existTask.status_date,
    });

    const updateTask = await this.taskQueryBuilderProvider
      .taskQueryBuilder()
      .addSelect(['tasks.updated_at', 'tasks.updated_by'])
      .where('tasks.id = :taskId', { taskId })
      .getOne();

    return updateTask;
  }
  //#endregion

  //#region deleteTask
  //: deleteTask
  async deleteTask(taskId: string, curUser: any) {
    const existTask = await this.taskRepo.findOne({
      where: {
        id: taskId,
      },
    });

    if (!existTask) {
      throw new NotFoundException('Task not found');
    }

    if (curUser.role === 'user') {
      if (curUser.sub !== existTask.user_id) {
        throw new ForbiddenException(
          'You do not have permission to create a task in this category',
        );
      }
    }

    const deleteTask = await this.taskRepo.delete(taskId);

    if (deleteTask.affected === 0) {
      throw new NotImplementedException('Delete task fail');
    }

    return 'Delete task success';
  }
  //#endregion

  //#region getReport
  //: getReport
  async getReport(getReportTaskRequest: GetReportTaskRequest, curUser: any) {
    const query = this.taskQueryBuilderProvider.taskQueryBuilder();

    const reportDate = getReportTaskRequest.date ?? new Date();
    const queryCreateAt =
      getReportTaskRequest.reportType === 'week'
        ? dayOfWeek(reportDate)
        : dayOfMonth(reportDate);

    query.where('tasks.created_at BETWEEN :firstDay AND :lastDay', {
      firstDay: queryCreateAt.firstDay,
      lastDay: queryCreateAt.lastDay,
    });

    const isAdmin = curUser.role === ROLE_ENUM.ADMIN;

    if (getReportTaskRequest.userId) {
      if (!isAdmin) {
        throw new ForbiddenException(
          'You do not have permission to access this resource',
        );
      } else {
        query.andWhere('tasks.user_id = :userId', {
          userId: getReportTaskRequest.userId,
        });
      }
    }

    if (!isAdmin) {
      query.andWhere('tasks.user_id = :userId', {
        userId: curUser.sub,
      });
    }

    applyFilter(query, getReportTaskRequest.keyword, 'tasks.status');

    applySort(
      query,
      getReportTaskRequest.sortField,
      getReportTaskRequest.sortOrder,
    );

    const tasks = await query.getMany();
    return {
      start_date: queryCreateAt.firstDay.toLocaleDateString(),
      end_date: queryCreateAt.lastDay.toLocaleDateString(),
      tasks,
    };
  }
  //#endregion

  //#region exportReport
  //: exportReport
  async exportReport(getReportTaskRequest: GetReportTaskRequest, curUser: any) {
    const result = await this.getReport(getReportTaskRequest, curUser);
    const tasks = result.tasks.map((task) => ({
      ID: task.user_of_task.id,
      User: task.user_of_task.email,
      'Task Name': task.name,
      'Start Date': task.start_date,
      'End Date': task.end_date,
      Status: task.status,
      'Status Date': task.status_date,
      'Created At': task.created_at,
      Creator: task.creator.email,
      Category: task.category_of_task.name,
    }));

    const worksheet = XLSX.utils.json_to_sheet(tasks);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Weekly Report');

    const keysOfTasks = Object.keys(tasks[0]);
    console.log(keysOfTasks);
    const totalColumns = keysOfTasks.length;
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 1, c: totalColumns + 1 } },
    ];

    worksheet['A1'] = { v: `${getReportTaskRequest.reportType}`, t: 's' };
    worksheet['A3'] = { v: 'Start Date', t: 's' };
    worksheet['B3'] = { v: result.start_date, t: 's' };
    worksheet['A4'] = { v: 'End Date', t: 's' };
    worksheet['B4'] = { v: result.end_date, t: 's' };

    const headerMerges = [];
    for (let i = 0; i < keysOfTasks.length; i++) {
      headerMerges.push({
        s: { r: 2, c: 2 + i },
        e: { r: 3, c: 2 + i },
      });

      worksheet[XLSX.utils.encode_cell({ r: 2, c: 2 + i })] = {
        v: keysOfTasks[i + 1],
        t: 's',
      };
    }

    // Thêm các ô gộp vào worksheet
    worksheet['!merges'] = worksheet['!merges']
      ? worksheet['!merges'].concat(headerMerges)
      : headerMerges;

    // Xuất file Excel
    XLSX.writeFile(workbook, 'Weekly_Report.xlsx');
  }
  //#endregion
}
