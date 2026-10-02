import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required');
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      password: hashedPassword,
    },
    create: {
      name: 'Administrator',
      email,
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log(`Admin user ready: ${email}`);
}

main()
  .catch((error) => {
    console.error('Admin seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
