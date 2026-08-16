import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { Booking, BookingStatus } from '../../domain/entities/booking.entity';

@Injectable()
export class CreateBookingUseCase {
  constructor(private readonly bookingRepository: BookingRepository) {}

  async execute(userId: number, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkIn >= checkOut) {
      throw new BadRequestException('checkIn must be before checkOut');
    }

    if (checkIn < new Date()) {
      throw new BadRequestException('checkIn cannot be in the past');
    }

    const overlapping = await this.bookingRepository.existsOverlappingBooking(
      dto.roomId,
      checkIn,
      checkOut,
    );

    if (overlapping) {
      throw new ConflictException(
        'Room is not available for the selected dates',
      );
    }

    const booking = Booking.create({
      id: 0,
      userId,
      roomId: dto.roomId,
      checkIn,
      checkOut,
      status: BookingStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.bookingRepository.create(booking);
  }
}
