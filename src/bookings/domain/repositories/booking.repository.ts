import { Booking } from '../entities/booking.entity';

export abstract class BookingRepository {
  abstract create(booking: Booking): Promise<Booking>;

  abstract findByUserId(userId: number): Promise<Booking[]>;

  abstract findById(id: number): Promise<Booking | null>;

  abstract existsOverlappingBooking(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean>;

  abstract update(booking: Booking): Promise<Booking>;
}
