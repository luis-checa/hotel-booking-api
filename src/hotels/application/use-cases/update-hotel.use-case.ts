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

    hotel.update(dto);

    return this.repository.update(hotel);
  }
}
