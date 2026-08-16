import { BadRequestException, Injectable } from '@nestjs/common';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { FindAvailableRoomsDto } from '../dto/find-available-rooms.dto';

@Injectable()
export class FindAvailableRoomsUseCase {
  constructor(private readonly repository: RoomRepository) {}

  execute(dto: FindAvailableRoomsDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkIn >= checkOut) {
      throw new BadRequestException('checkIn must be before checkOut');
    }

    return this.repository.findAvailable(dto.hotelId, checkIn, checkOut);
  }
}
