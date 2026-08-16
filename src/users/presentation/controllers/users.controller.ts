import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';

import { CreateUserDto } from '../../application/dto/create-user.dto';
import { CreateUserUseCase } from '../../application/use-cases/create-user.use-case';
import { Roles } from '../../../auth/presentation/decorators/roles.decorator';
import { UserRole } from '../../domain/entities/user.entity';
import { RolesGuard } from '../../../auth/presentation/guards/roles.guard';
import { JwtAuthGuard } from '../../../auth/presentation/guards/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @Get('admin-test')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  adminTest() {
    return {
      message: 'You are an admin',
    };
  }
}
