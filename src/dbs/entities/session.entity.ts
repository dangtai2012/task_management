import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('sessions')
export class SessionEntity {
  //#region COLUMNS
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id!: string;

  @Column('varchar', { name: 'access_token', nullable: false })
  access_token!: string;

  @Column('varchar', { name: 'refresh_token', nullable: false })
  refresh_token!: string;

  @CreateDateColumn({ name: 'login_at', type: 'timestamp' })
  login_at!: Date;

  @Column('timestamp', { name: 'logout_at', nullable: true })
  logout_at: Date | null;
  //#endregion

  //#region RELATIONS
  @ManyToOne(() => UserEntity, (user) => user.sessions, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'user_id' })
  user_id!: UserEntity;
  //#endregion
}
