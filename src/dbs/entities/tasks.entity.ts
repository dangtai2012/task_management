import { TASK_STATUS_ENUM } from 'src/constants';
import {
  AfterLoad,
  AfterUpdate,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { CategoriesEntity } from './categories.enitity';

@Entity('tasks')
export class TaskEntity {
  //#region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('uuid', { name: 'user_id', nullable: false })
  user_id!: string;

  @Column('uuid', { name: 'category_id', nullable: false })
  category_id!: string;

  @Column('varchar', { name: 'name', nullable: false })
  name!: string;

  @Column('varchar', { name: 'slug', nullable: false })
  slug!: string;

  @Column('enum', {
    name: 'status',
    enum: TASK_STATUS_ENUM,
    default: TASK_STATUS_ENUM.PENDING,
  })
  status!: TASK_STATUS_ENUM;

  @Column('timestamp', { name: 'start_date', nullable: false })
  start_date: Date;

  @Column('timestamp', { name: 'end_date', nullable: false })
  end_date: Date;

  @Column('timestamp', { name: 'status_date', nullable: false })
  status_date: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @Column('uuid', { name: 'created_by', nullable: false })
  created_by!: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;

  @Column('uuid', { name: 'updated_by', nullable: true })
  updated_by: string;
  //#endregion

  //#region RELATIONS

  //: user_id -> task_user_id
  @ManyToOne(() => UserEntity, (user) => user.task_of_user)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user_of_task: UserEntity;

  //: created_by -> task_created_by
  @ManyToOne(() => UserEntity, (user) => user.task_of_creator, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  creator: UserEntity;

  @ManyToOne(() => CategoriesEntity, (categories) => categories.tasks)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category_of_task: CategoriesEntity;
  //#endregion

  //#region OTHERS
  //#endregion
}
