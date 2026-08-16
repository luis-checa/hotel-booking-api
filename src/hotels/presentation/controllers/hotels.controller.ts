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
import { CreateHotelUseCase } from '../../application/use-cases/create-hotel.use-case';
import { FindHotelsUseCase } from '../../application/use-cases/find-hotels.use-case';
import { FindHotelUseCase } from '../../application/use-cases/find-hotel.use-case';
import { UpdateHotelUseCase } from '../../application/use-cases/update-hotel.use-case';
import { DeleteHotelUseCase } from '../../application/use-cases/delete-hotel.use-case';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { UpdateHotelDto } from '../../application/dto/update-hotel.dto';
import { UserRole } from '../../../users/domain/entities/user.entity';
import { CreateHotelDto } from '../../application/dto/create-hotel.dto';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly createHotel: CreateHotelUseCase,
    private readonly findHotels: FindHotelsUseCase,
    private readonly findHotel: FindHotelUseCase,
    private readonly updateHotel: UpdateHotelUseCase,
    private readonly deleteHotel: DeleteHotelUseCase,
  ) {}

  @Get()
  findAll() {
    return this.findHotels.execute();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findHotel.execute(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() dto: CreateHotelDto) {
    return this.createHotel.execute(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHotelDto) {
    return this.updateHotel.execute(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.deleteHotel.execute(id);
  }
}
