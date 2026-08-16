import { Injectable } from '@nestjs/common';
import { RoomRepository } from '../../domain/repositories/room.repository';

@Injectable()
export class FindRoomsByHotelUseCase {
  constructor(private readonly repository: RoomRepository) {}

  execute(hotelId: number) {
    return this.repository.findByHotelId(hotelId);
  }
}
