import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/dbs/entities/tasks.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TaskQueryBuilderProvider {
  constructor(
    /**
     * : Inject repository
     */
    @InjectRepository(TaskEntity)
    private readonly taskRepo: Repository<TaskEntity>,
  ) {}

  /**
   * : taskQueryBuilder
   */
  taskQueryBuilder() {
    return this.taskRepo
      .createQueryBuilder('tasks')
      .select([
        'tasks.id',
        'tasks.name',
        'tasks.slug',
        'tasks.status',
        'tasks.start_date',
        'tasks.created_at',
        'tasks.end_date',
        'tasks.status_date',
      ])
      .leftJoin('tasks.creator', 'creator')
      .addSelect(['creator.id', 'creator.email', 'creator.role'])
      .leftJoin('tasks.user_of_task', 'user_of_task')
      .addSelect(['user_of_task.id', 'user_of_task.email', 'user_of_task.role'])
      .leftJoin('tasks.category_of_task', 'category_of_task')
      .addSelect(['category_of_task.id', 'category_of_task.name'])
      .leftJoin('category_of_task.user_of_category', 'user_of_category')
      .addSelect([
        'user_of_category.id',
        'user_of_category.email',
        'user_of_category.role',
      ]);
  }
}
