import { Module } from '@nestjs/common';
import { BookingsController } from './presentation/controllers/bookings.controller';
import { CreateBookingUseCase } from './application/use-cases/create-booking.use-case';
import { FindMyBookingsUseCase } from './application/use-cases/find-my-bookings.use-case';
import { CancelBookingUseCase } from './application/use-cases/cancel-booking.use-case';
import { BookingRepository } from './domain/repositories/booking.repository';
import { PrismaBookingRepository } from './infrastructure/repositories/prisma-booking.repository';
import { ConfirmBookingUseCase } from './application/use-cases/confirm-booking.use-case';

@Module({
  controllers: [BookingsController],
  providers: [
    CreateBookingUseCase,
    FindMyBookingsUseCase,
    CancelBookingUseCase,
    ConfirmBookingUseCase,
    {
      provide: BookingRepository,
      useClass: PrismaBookingRepository,
    },
  ],
})
export class BookingsModule {}
