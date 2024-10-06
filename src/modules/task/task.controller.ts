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
  Query,
  Req,
} from '@nestjs/common';
import { TaskService } from './services/task.service';
import { CreateTaskRequest } from './requests/create-task.request';
import { CURRENT_USER } from 'src/constants';
import {
  ReportResponse,
  TaskPaginatedRespones,
  TaskResponse,
} from './response/task.response';
import { SearchSortPaginationRequest } from 'src/system/dbs/requests/search-sort-pagination.request';
import { UpdateTaskRequest } from './requests/update-task.request';
import { GetReportTaskRequest } from './requests/get-report-task.request';
import { DataResponse } from 'src/system/response';

@Controller('task')
export class TaskController {
  constructor(
    /**
     * : Inject service, provider
     */

    private readonly taskService: TaskService,
  ) {}

  //#region createTask
  //: createTask
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createTask(
    @Body() createTaskRequest: CreateTaskRequest,
    @Req() req: Request,
  ) {
    const task = await this.taskService.createTask(
      createTaskRequest,
      req[CURRENT_USER],
    );

    return new TaskResponse('Create task success', task);
  }
  //#endregion

  //#region getTask
  //: getTask
  @Get()
  @HttpCode(HttpStatus.OK)
  async getTask(
    @Body() sspRequest: SearchSortPaginationRequest,
    @Req() req: Request,
  ) {
    const tasks = await this.taskService.getTask(sspRequest, req[CURRENT_USER]);
    return new TaskPaginatedRespones(
      tasks,
      tasks.length,
      sspRequest.page,
      sspRequest.size,
      'Get tasks success',
    );
  }
  //#endregion

  //#region getReport
  //: getReport
  @Get('get-report')
  @HttpCode(HttpStatus.OK)
  async getReport(
    @Query() getReportTaskRequest: GetReportTaskRequest,
    @Req() req: Request,
  ) {
    const result = await this.taskService.getReport(
      getReportTaskRequest,
      req[CURRENT_USER],
    );

    return new ReportResponse(
      `Get ${getReportTaskRequest.reportType} report success`,
      getReportTaskRequest.reportType,
      result.start_date,
      result.end_date,
      result.tasks,
    );
  }
  //#endregion

  //#region exportReport
  //: exportReport
  @Get('export-report')
  @HttpCode(HttpStatus.OK)
  async exportReport(
    @Query() getReportTaskRequest: GetReportTaskRequest,
    @Req() req: Request,
  ) {
    const result = await this.taskService.exportReport(
      getReportTaskRequest,
      req[CURRENT_USER],
    );
  }
  //#endregion

  //#region getTaskById
  //: getTaskById
  @Get('/:taskId')
  @HttpCode(HttpStatus.OK)
  async getTaskById(@Param('taskId') taskId: string, @Req() req: Request) {
    const task = await this.taskService.getTaskById(taskId, req[CURRENT_USER]);
    return new TaskResponse('Get task success', task);
  }
  //#endregion

  //#region updateTask
  //: updateTask
  @Patch('/:taskId')
  @HttpCode(HttpStatus.ACCEPTED)
  async updateTask(
    @Body() updateTaskRequest: UpdateTaskRequest,
    @Param('taskId') taskId: string,
    @Req() req: Request,
  ) {
    const updateTask = await this.taskService.updateTask(
      updateTaskRequest,
      taskId,
      req[CURRENT_USER],
    );
    return new TaskResponse('Update task success', updateTask);
  }
  //#endregion

  //#region deleteTask
  //: deleteTask
  @Delete('/:taskId')
  @HttpCode(HttpStatus.ACCEPTED)
  async deleteTask(@Param('taskId') taskId: string, @Req() req: Request) {
    const messsage = await this.taskService.deleteTask(
      taskId,
      req[CURRENT_USER],
    );

    return new TaskResponse(messsage);
  }
  //#endregion
}
