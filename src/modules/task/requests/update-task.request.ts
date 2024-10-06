import { PartialType } from '@nestjs/swagger';
import { CreateTaskRequest } from './create-task.request';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { TASK_STATUS_ENUM } from 'src/constants';

export class UpdateTaskRequest extends PartialType(CreateTaskRequest) {
  @IsString()
  @IsOptional()
  status?: TASK_STATUS_ENUM;
}
