import { Injectable } from '@nestjs/common';
import { HotelRepository } from '../../domain/repositories/hotel.repository';

@Injectable()
export class FindHotelsUseCase {
  constructor(private readonly repository: HotelRepository) {}

  execute() {
    return this.repository.findAll();
  }
}
