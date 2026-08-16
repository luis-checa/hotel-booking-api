import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Room, RoomType } from '../../domain/entities/room.entity';
import { RoomRepository } from '../../domain/repositories/room.repository';

@Injectable()
export class PrismaRoomRepository implements RoomRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(room: any): Room {
    return Room.create({
      id: room.id,
      number: room.number,
      type: room.type as RoomType,
      price: Number(room.price),
      capacity: room.capacity,
      hotelId: room.hotelId,
      createdAt: room.createdAt,
      updatedAt: room.updatedAt,
    });
  }

  async create(room: Room): Promise<Room> {
    const created = await this.prisma.room.create({
      data: {
        number: room.number,
        type: room.type,
        price: room.price,
        capacity: room.capacity,
        hotelId: room.hotelId,
      },
    });

    return this.toDomain(created);
  }

  async findById(id: number): Promise<Room | null> {
    const room = await this.prisma.room.findUnique({
      where: { id },
    });

    return room ? this.toDomain(room) : null;
  }

  async findByHotelId(hotelId: number): Promise<Room[]> {
    const rooms = await this.prisma.room.findMany({
      where: { hotelId },
    });

    return rooms.map((room) => this.toDomain(room));
  }

  async update(room: Room): Promise<Room> {
    const updated = await this.prisma.room.update({
      where: { id: room.id },
      data: {
        number: room.number,
        type: room.type,
        price: room.price,
        capacity: room.capacity,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.room.delete({
      where: { id },
    });
  }
}
