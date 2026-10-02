import { PrismaService } from '../src/shared/infrastructure/prisma/prisma.service';
import { UserRole } from '../src/users/domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import 'dotenv/config';

const prisma = new PrismaService();

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
      role: UserRole.ADMIN,
    },
    create: {
      name: 'Administrator',
      email,
      password: hashedPassword,
      role: UserRole.ADMIN,
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
