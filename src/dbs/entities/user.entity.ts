import { ROLE_ENUM } from 'src/constants';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SessionEntity } from './session.entity';
import { PasswordResetEntity } from './password-reset.entity';
import { Exclude } from 'class-transformer';
import { CategoriesEntity } from './categories.enitity';
import { TaskEntity } from './tasks.entity';
@Entity('users')
export class UserEntity {
  //#region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'first_name', length: 96, nullable: false })
  first_name!: string;

  @Column('varchar', { name: 'last_name', length: 96, nullable: false })
  last_name!: string;

  @Column('varchar', {
    name: 'email',
    length: 96,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column('varchar', {
    name: 'password',
    length: 96,
    nullable: false,
    select: false,
  })
  password!: string;

  @Column('varchar', { name: 'role', default: ROLE_ENUM.USER })
  role!: ROLE_ENUM;

  @Column('boolean', { name: 'is_active', default: false })
  is_active!: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deleted_at: Date;
  //#endregion

  //#region RELATIONS
  @OneToMany(() => SessionEntity, (session) => session.user_id)
  sessions: SessionEntity[];

  @OneToMany(
    () => PasswordResetEntity,
    (password_resets) => password_resets.user_of_password_reset,
  )
  password_resets: PasswordResetEntity[];

  @OneToMany(
    () => CategoriesEntity,
    (categories) => categories.user_of_category,
  )
  category_of_user: CategoriesEntity[];

  @OneToMany(() => TaskEntity, (task) => task.creator)
  task_of_creator: TaskEntity[];

  @OneToMany(() => TaskEntity, (task) => task.user_of_task)
  task_of_user: TaskEntity[];
  //#endregion

  //#region OTHERS
  //#endregion
}
