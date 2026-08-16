import { IsDateString, IsInt, IsPositive } from 'class-validator';

export class FindAvailableRoomsDto {
  @IsInt()
  @IsPositive()
  hotelId!: number;

  @IsDateString()
  checkIn!: string;

  @IsDateString()
  checkOut!: string;
}
