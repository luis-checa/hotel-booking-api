import { Room } from '../entities/room.entity';

export abstract class RoomRepository {
  abstract create(room: Room): Promise<Room>;
  abstract findById(id: number): Promise<Room | null>;
  abstract findByHotelId(hotelId: number): Promise<Room[]>;
  abstract update(room: Room): Promise<Room>;
  abstract delete(id: number): Promise<void>;
}
