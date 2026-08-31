import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export async function seedE2E() {
  await prisma.booking.deleteMany();
  const password = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {
      password,
    },
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password,
      role: 'USER',
    },
  });

  const hotel = await prisma.hotel.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'Hotel E2E',
      address: 'Test Address',
      description: 'Hotel for E2E tests',
    },
  });

  await prisma.room.upsert({
    where: {
      hotelId_number: {
        hotelId: hotel.id,
        number: '101',
      },
    },
    update: {},
    create: {
      number: '101',
      type: 'DOUBLE',
      price: 100,
      capacity: 2,
      hotelId: hotel.id,
    },
  });

  return { user, hotel };
}

export async function closeSeed() {
  await prisma.$disconnect();
}
