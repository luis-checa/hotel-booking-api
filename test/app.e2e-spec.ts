import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../src/app.module';

describe('Booking flow (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let roomId: number;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    await app.init();
  });

  afterAll(async () => {
    await app.close();
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

    roomId = response.body[0].id;
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

    expect(response.body.id).toBeDefined();
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
