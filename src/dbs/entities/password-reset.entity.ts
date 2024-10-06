import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('password_resets')
export class PasswordResetEntity {
  //#region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'token', nullable: false })
  token!: string;

  @Column('varchar', { name: 'user_id', nullable: false })
  user_id!: string;

  @Column({ name: 'expires_at', type: 'timestamp' })
  expires_at!: Date;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  created_at!: Date;
  //#endregion

  //#region RELATIONS
  @ManyToOne(() => UserEntity, (user) => user.password_resets, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user_of_password_reset: UserEntity;
  //#endregion
}
