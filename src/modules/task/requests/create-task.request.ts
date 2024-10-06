import { IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskRequest {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  category_id!: string;

  @IsDate()
  @IsNotEmpty()
  start_date!: Date;

  @IsDate()
  @IsNotEmpty()
  end_date!: Date;
}
