import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from '../dto/create-room.dto';
import { RoomRepository } from '../../domain/repositories/room.repository';
import { Room } from '../../domain/entities/room.entity';

@Injectable()
export class CreateRoomUseCase {
  constructor(private readonly repository: RoomRepository) {}

  execute(dto: CreateRoomDto) {
    const room = Room.create({
      id: 0,
      number: dto.number,
      type: dto.type,
      price: dto.price,
      capacity: dto.capacity,
      hotelId: dto.hotelId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.repository.create(room);
  }
}
