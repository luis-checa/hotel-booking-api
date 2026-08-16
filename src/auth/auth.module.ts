import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { UserRepository } from '../users/domain/repositories/user.repository';
import { PrismaUserRepository } from '../users/infrastructure/repositories/prisma-user.repository';

import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthController } from './presentation/controllers/auth.controller';
import { AuthJwtService } from './infrastructure/services/jwt.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    AuthJwtService,
    JwtStrategy,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
})
export class AuthModule {}
