import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../../users/domain/entities/user.entity';

@Injectable()
export class AuthJwtService {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(user: User): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}
