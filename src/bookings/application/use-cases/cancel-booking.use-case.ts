import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from '../../domain/repositories/booking.repository';

@Injectable()
export class CancelBookingUseCase {
  constructor(private readonly repository: BookingRepository) {}

  async execute(id: number, userId: number) {
    const booking = await this.repository.findById(id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.userId !== userId) {
      throw new ForbiddenException('You cannot cancel this booking');
    }

    booking.cancel();

    return this.repository.update(booking);
  }
}
