import { Module } from '@nestjs/common';
import { HotelsController } from './presentation/controllers/hotels.controller';
import { CreateHotelUseCase } from './application/use-cases/create-hotel.use-case';
import { FindHotelsUseCase } from './application/use-cases/find-hotels.use-case';
import { FindHotelUseCase } from './application/use-cases/find-hotel.use-case';
import { UpdateHotelUseCase } from './application/use-cases/update-hotel.use-case';
import { DeleteHotelUseCase } from './application/use-cases/delete-hotel.use-case';
import { HotelRepository } from './domain/repositories/hotel.repository';
import { PrismaHotelRepository } from './infrastructure/repositories/prisma-hotel.repository';

@Module({
  controllers: [HotelsController],
  providers: [
    CreateHotelUseCase,
    FindHotelsUseCase,
    FindHotelUseCase,
    UpdateHotelUseCase,
    DeleteHotelUseCase,
    {
      provide: HotelRepository,
      useClass: PrismaHotelRepository,
    },
  ],
})
export class HotelsModule {}
