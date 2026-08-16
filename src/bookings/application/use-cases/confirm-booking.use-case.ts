import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingRepository } from '../../domain/repositories/booking.repository';

@Injectable()
export class ConfirmBookingUseCase {
  constructor(private readonly repository: BookingRepository) {}

  async execute(id: number) {
    const booking = await this.repository.findById(id);

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    const overlapping = await this.repository.existsOverlappingBooking(
      booking.roomId,
      booking.checkIn,
      booking.checkOut,
      booking.id,
    );

    if (overlapping) {
      throw new ConflictException('Room is no longer available');
    }

    booking.confirm();

    return this.repository.update(booking);
  }
}
