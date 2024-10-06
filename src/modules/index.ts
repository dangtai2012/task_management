import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './category/category.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

export const modules = [AuthModule, UserModule, CategoryModule, TaskModule];
