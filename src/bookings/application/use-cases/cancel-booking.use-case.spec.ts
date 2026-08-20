import { Booking, BookingStatus } from '../../domain/entities/booking.entity';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { CancelBookingUseCase } from './cancel-booking.use-case';

describe('CancelBookingUseCase', () => {
  let useCase: CancelBookingUseCase;
  let repository: jest.Mocked<BookingRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      existsOverlappingBooking: jest.fn(),
      update: jest.fn(),
    };

    useCase = new CancelBookingUseCase(repository);
  });

  it('should cancel user booking', async () => {
    const booking = Booking.create({
      id: 1,
      userId: 10,
      roomId: 5,
      checkIn: new Date('2026-09-01'),
      checkOut: new Date('2026-09-05'),
      status: BookingStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    repository.findById.mockResolvedValue(booking);
    repository.update.mockResolvedValue(booking);

    await useCase.execute(1, 10);

    expect(repository.update).toHaveBeenCalled();
    expect(booking.status).toBe(BookingStatus.CANCELLED);
  });

  it('should reject another user cancelling the booking', async () => {
    const booking = Booking.create({
      id: 1,
      userId: 10,
      roomId: 5,
      checkIn: new Date('2026-09-01'),
      checkOut: new Date('2026-09-05'),
      status: BookingStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    repository.findById.mockResolvedValue(booking);

    await expect(useCase.execute(1, 999)).rejects.toThrow(
      'You cannot cancel this booking',
    );

    expect(repository.update).not.toHaveBeenCalled();
  });
});
