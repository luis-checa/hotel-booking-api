import { Module } from '@nestjs/common';
import { RoomsController } from './presentation/controllers/rooms.controller';
import { CreateRoomUseCase } from './application/use-cases/create-room.use-case';
import { FindRoomsByHotelUseCase } from './application/use-cases/find-rooms-by-hotel.use-case';
import { UpdateRoomUseCase } from './application/use-cases/update-room.use-case';
import { DeleteRoomUseCase } from './application/use-cases/delete-room.use-case';
import { RoomRepository } from './domain/repositories/room.repository';
import { PrismaRoomRepository } from './infrastructure/repositories/prisma-room.repository';
import { FindAvailableRoomsUseCase } from './application/use-cases/find-available-rooms.use-case';

@Module({
  controllers: [RoomsController],
  providers: [
    CreateRoomUseCase,
    FindRoomsByHotelUseCase,
    UpdateRoomUseCase,
    DeleteRoomUseCase,
    FindAvailableRoomsUseCase,
    {
      provide: RoomRepository,
      useClass: PrismaRoomRepository,
    },
  ],
})
export class RoomsModule {}
