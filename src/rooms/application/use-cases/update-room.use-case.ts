import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { UpdateRoomDto } from '../dto/update-room.dto';

@Injectable()
export class UpdateRoomUseCase {
  constructor(private readonly repository: RoomRepository) {}

  async execute(id: number, dto: UpdateRoomDto) {
    const room = await this.repository.findById(id);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    room.update(dto);

    return this.repository.update(room);
  }
}
