import { BookingRepository } from '../../domain/repositories/booking.repository';
import { CreateBookingUseCase } from './create-booking.use-case';

describe('CreateBookingUseCase', () => {
  let useCase: CreateBookingUseCase;
  let repository: jest.Mocked<BookingRepository>;

  beforeEach(() => {
    repository = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findById: jest.fn(),
      existsOverlappingBooking: jest.fn(),
      update: jest.fn(),
    };

    useCase = new CreateBookingUseCase(repository);
  });

  it('should create a booking', async () => {
    repository.existsOverlappingBooking.mockResolvedValue(false);

    const booking = {
      id: 1,
    } as any;

    repository.create.mockResolvedValue(booking);

    const result = await useCase.execute(1, {
      roomId: 10,
      checkIn: '2026-09-01T15:00:00.000Z',
      checkOut: '2026-09-05T11:00:00.000Z',
    });

    expect(repository.create).toHaveBeenCalled();
    expect(result).toBe(booking);
  });

  it('should reject overlapping booking', async () => {
    repository.existsOverlappingBooking.mockResolvedValue(true);

    await expect(
      useCase.execute(1, {
        roomId: 10,
        checkIn: '2026-09-01T15:00:00.000Z',
        checkOut: '2026-09-05T11:00:00.000Z',
      }),
    ).rejects.toThrow('Room is not available for the selected dates');

    expect(repository.create).not.toHaveBeenCalled();
  });

  it('should reject invalid date range', async () => {
    await expect(
      useCase.execute(1, {
        roomId: 10,
        checkIn: '2026-09-05T15:00:00.000Z',
        checkOut: '2026-09-01T11:00:00.000Z',
      }),
    ).rejects.toThrow('checkIn must be before checkOut');
  });
});
