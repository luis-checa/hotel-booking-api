import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { seedE2E, closeSeed } from './seed-e2e';

import { AppModule } from '../src/app.module';

describe('Booking flow (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let roomId: number;

  beforeAll(async () => {
    await seedE2E();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await closeSeed();
  });

  it('should login and obtain JWT', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(200);

    expect(response.body.accessToken).toBeDefined();

    token = response.body.accessToken;
  });

  it('should find available rooms', async () => {
    const response = await request(app.getHttpServer())
      .get('/rooms/available')
      .query({
        hotelId: 1,
        checkIn: '2026-09-01T15:00:00.000Z',
        checkOut: '2026-09-05T11:00:00.000Z',
      })
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);

    roomId = response.body[0].props.id;
  });

  it('should create a booking', async () => {
    const response = await request(app.getHttpServer())
      .post('/bookings')
      .set('Authorization', `Bearer ${token}`)
      .send({
        roomId,
        checkIn: '2026-09-01T15:00:00.000Z',
        checkOut: '2026-09-05T11:00:00.000Z',
      })
      .expect(201);

    expect(response.body.props.id).toBeDefined();
  });

  it('should get my bookings', async () => {
    const response = await request(app.getHttpServer())
      .get('/bookings/me')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
});
