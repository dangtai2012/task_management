import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './services/task.service';
import { CategoryModule } from '../category/category.module';
import { UserModule } from '../user/user.module';
import { TaskQueryBuilderProvider } from './services/task-query-builder.provider';

@Module({
  imports: [CategoryModule, UserModule],
  controllers: [TaskController],
  providers: [TaskService, TaskQueryBuilderProvider],
  exports: [TaskService],
})
export class TaskModule {}
