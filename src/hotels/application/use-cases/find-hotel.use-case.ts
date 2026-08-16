import { Injectable, NotFoundException } from '@nestjs/common';
import { HotelRepository } from '../../domain/repositories/hotel.repository';

@Injectable()
export class FindHotelUseCase {
  constructor(private readonly repository: HotelRepository) {}

  async execute(id: number) {
    const hotel = await this.repository.findById(id);

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    return hotel;
  }
}
