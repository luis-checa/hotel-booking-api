import { Hotel } from '../entities/hotel.entity';

export abstract class HotelRepository {
  abstract create(hotel: Hotel): Promise<Hotel>;
  abstract findAll(): Promise<Hotel[]>;
  abstract findById(id: number): Promise<Hotel | null>;
  abstract update(hotel: Hotel): Promise<Hotel>;
  abstract delete(id: number): Promise<void>;
}
