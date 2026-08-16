import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { Hotel } from '../../domain/entities/hotel.entity';
import { HotelRepository } from '../../domain/repositories/hotel.repository';

@Injectable()
export class PrismaHotelRepository implements HotelRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(hotel: any): Hotel {
    return Hotel.create({
      id: hotel.id,
      name: hotel.name,
      address: hotel.address,
      description: hotel.description,
      createdAt: hotel.createdAt,
      updatedAt: hotel.updatedAt,
    });
  }

  async create(hotel: Hotel): Promise<Hotel> {
    const created = await this.prisma.hotel.create({
      data: {
        name: hotel.name,
        address: hotel.address,
        description: hotel.description,
      },
    });

    return this.toDomain(created);
  }

  async findAll(): Promise<Hotel[]> {
    const hotels = await this.prisma.hotel.findMany();

    return hotels.map((hotel) => this.toDomain(hotel));
  }

  async findById(id: number): Promise<Hotel | null> {
    const hotel = await this.prisma.hotel.findUnique({
      where: { id },
    });

    return hotel ? this.toDomain(hotel) : null;
  }

  async update(hotel: Hotel): Promise<Hotel> {
    const updated = await this.prisma.hotel.update({
      where: { id: hotel.id },
      data: {
        name: hotel.name,
        address: hotel.address,
        description: hotel.description,
      },
    });

    return this.toDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.hotel.delete({
      where: { id },
    });
  }
}
