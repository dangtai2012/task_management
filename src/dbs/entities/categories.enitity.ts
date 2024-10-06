import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TaskEntity } from './tasks.entity';

@Entity('categories')
export class CategoriesEntity {
  //#region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('uuid', { name: 'user_id', nullable: false })
  user_id!: string;

  @Column('varchar', { name: 'name', nullable: false })
  name!: string;

  @Column('varchar', { name: 'slug', nullable: false })
  slug!: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updated_at: Date;
  //#endregion

  //#region RELATIONS
  @ManyToOne(() => UserEntity, (user) => user.category_of_user)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user_of_category: UserEntity;

  @OneToMany(() => TaskEntity, (task) => task.category_of_task)
  tasks: TaskEntity[];
  //#endregion
}
