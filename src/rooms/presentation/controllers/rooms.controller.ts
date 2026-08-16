import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateRoomUseCase } from '../../application/use-cases/create-room.use-case';
import { FindRoomsByHotelUseCase } from '../../application/use-cases/find-rooms-by-hotel.use-case';
import { UpdateRoomUseCase } from '../../application/use-cases/update-room.use-case';
import { DeleteRoomUseCase } from '../../application/use-cases/delete-room.use-case';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { CreateRoomDto } from '../../application/dto/create-room.dto';
import { UpdateRoomDto } from '../../application/dto/update-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(
    private readonly createRoom: CreateRoomUseCase,
    private readonly findRoomsByHotel: FindRoomsByHotelUseCase,
    private readonly updateRoom: UpdateRoomUseCase,
    private readonly deleteRoom: DeleteRoomUseCase,
  ) {}

  @Get('hotel/:hotelId')
  findByHotel(@Param('hotelId', ParseIntPipe) hotelId: number) {
    return this.findRoomsByHotel.execute(hotelId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateRoomDto) {
    return this.createRoom.execute(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRoomDto) {
    return this.updateRoom.execute(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteRoom.execute(id);
  }
}
