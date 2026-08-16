import { Injectable } from '@nestjs/common';
import { Booking } from '../../domain/entities/booking.entity';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { BookingRepository } from '../../domain/repositories/booking.repository';

@Injectable()
export class PrismaBookingRepository implements BookingRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toDomain(booking: any): Booking {
    return Booking.create({
      id: booking.id,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      status: booking.status,
      userId: booking.userId,
      roomId: booking.roomId,
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
    });
  }

  async create(booking: Booking): Promise<Booking> {
    const created = await this.prisma.booking.create({
      data: {
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        status: booking.status,
        userId: booking.userId,
        roomId: booking.roomId,
      },
    });

    return this.toDomain(created);
  }

  async findByUserId(userId: number): Promise<Booking[]> {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      orderBy: { checkIn: 'desc' },
    });

    return bookings.map((booking) => this.toDomain(booking));
  }

  async findById(id: number): Promise<Booking | null> {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
    });

    return booking ? this.toDomain(booking) : null;
  }

  async existsOverlappingBooking(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
    excludeBookingId?: number,
  ): Promise<boolean> {
    const booking = await this.prisma.booking.findFirst({
      where: {
        roomId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: {
          in: ['PENDING', 'CONFIRMED'],
        },
        checkIn: { lt: checkOut },
        checkOut: { gt: checkIn },
      },
    });

    return !!booking;
  }

  async update(booking: Booking): Promise<Booking> {
    const updated = await this.prisma.booking.update({
      where: { id: booking.id },
      data: {
        status: booking.status,
      },
    });

    return this.toDomain(updated);
  }
}
