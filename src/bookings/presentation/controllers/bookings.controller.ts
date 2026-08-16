import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { CreateBookingUseCase } from '../../application/use-cases/create-booking.use-case';
import { FindMyBookingsUseCase } from '../../application/use-cases/find-my-bookings.use-case';
import { CancelBookingUseCase } from '../../application/use-cases/cancel-booking.use-case';
import { CreateBookingDto } from '../../application/dto/create-booking.dto';

@Controller('bookings')
export class BookingsController {
  constructor(
    private readonly createBooking: CreateBookingUseCase,
    private readonly findMyBookings: FindMyBookingsUseCase,
    private readonly cancelBooking: CancelBookingUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() dto: CreateBookingDto,
    @Req() request: Request & { user: { id: number } },
  ) {
    return this.createBooking.execute(request.user.id, dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  findMine(@Req() request: Request & { user: { id: number } }) {
    return this.findMyBookings.execute(request.user.id);
  }

  @Patch(':id/cancel')
  @UseGuards(JwtAuthGuard)
  cancel(
    @Param('id', ParseIntPipe) id: number,
    @Req() request: Request & { user: { id: number } },
  ) {
    return this.cancelBooking.execute(id, request.user.id);
  }
}
