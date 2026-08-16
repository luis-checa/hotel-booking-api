import { Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { HotelRepository } from '../../domain/repositories/hotel.repository';
import { Hotel } from '../../domain/entities/hotel.entity';

@Injectable()
export class CreateHotelUseCase {
  constructor(private readonly repository: HotelRepository) {}

  async execute(dto: CreateHotelDto) {
    const hotel = Hotel.create({
      id: 0,
      name: dto.name,
      address: dto.address,
      description: dto.description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.repository.create(hotel);
  }
}
