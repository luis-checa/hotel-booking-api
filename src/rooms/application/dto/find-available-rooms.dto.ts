import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class FindAvailableRoomsDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  hotelId!: number;

  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;
}
