import { Injectable, NotFoundException } from '@nestjs/common';
import { RoomRepository } from '../../domain/repositories/room.repository';

@Injectable()
export class DeleteRoomUseCase {
  constructor(private readonly repository: RoomRepository) {}

  async execute(id: number) {
    const room = await this.repository.findById(id);

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    await this.repository.delete(id);
  }
}
