import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateHotelDto } from '../dto/update-hotel.dto';
import { HotelRepository } from '../../domain/repositories/hotel.repository';

@Injectable()
export class UpdateHotelUseCase {
  constructor(private readonly repository: HotelRepository) {}

  async execute(id: number, dto: UpdateHotelDto) {
    const hotel = await this.repository.findById(id);

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    hotel.update({
      ...(dto.name !== undefined && { name: dto.name.trim() }),
      ...(dto.address !== undefined && { address: dto.address.trim() }),
      ...(dto.description !== undefined && {
        description: dto.description.trim(),
      }),
    });

    return this.repository.update(hotel);
  }
}
