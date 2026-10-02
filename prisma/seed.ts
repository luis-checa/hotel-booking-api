import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Starting seed...');

  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();
  await prisma.hotel.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@hotel.com',
      password: await bcrypt.hash('Admin1234', 12),
      role: 'ADMIN',
    },
  });

  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'user@hotel.com',
      password: await bcrypt.hash('User1234', 12),
      role: 'USER',
    },
  });

  const hotel = await prisma.hotel.create({
    data: {
      name: 'Hotel Central',
      address: 'Av. Principal 123',
      description: 'Hotel ubicado en el centro de la ciudad.',
    },
  });

  const secondHotel = await prisma.hotel.create({
    data: {
      name: 'Hotel Pacific',
      address: 'Av. Pacifico 456',
      description: 'Hotel cercano a la costa.',
    },
  });

  await prisma.room.create({
    data: {
      number: '101',
      type: 'SINGLE',
      price: 80,
      capacity: 1,
      hotelId: hotel.id,
    },
  });

  const room = await prisma.room.create({
    data: {
      number: '102',
      type: 'DOUBLE',
      price: 120,
      capacity: 2,
      hotelId: hotel.id,
    },
  });

  await prisma.room.create({
    data: {
      number: '201',
      type: 'SUITE',
      price: 200,
      capacity: 4,
      hotelId: secondHotel.id,
    },
  });

  const checkIn = new Date();
  checkIn.setDate(checkIn.getDate() + 7);

  const checkOut = new Date();
  checkOut.setDate(checkOut.getDate() + 10);

  await prisma.booking.create({
    data: {
      userId: user.id,
      roomId: room.id,
      checkIn,
      checkOut,
      status: 'PENDING',
    },
  });

  console.log('Seed completed');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
