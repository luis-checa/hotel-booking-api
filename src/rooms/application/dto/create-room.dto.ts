import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

import { RoomType } from '../../domain/entities/room.entity';

export class CreateRoomDto {
  @IsString()
  @IsNotEmpty()
  number!: string;

  @IsEnum(RoomType)
  type!: RoomType;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsInt()
  @IsPositive()
  capacity!: number;

  @IsInt()
  @IsPositive()
  hotelId!: number;
}
