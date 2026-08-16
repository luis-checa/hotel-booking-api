import { Injectable } from '@nestjs/common';
import { BookingRepository } from '../../domain/repositories/booking.repository';

@Injectable()
export class FindMyBookingsUseCase {
  constructor(private readonly repository: BookingRepository) {}

  execute(userId: number) {
    return this.repository.findByUserId(userId);
  }
}
