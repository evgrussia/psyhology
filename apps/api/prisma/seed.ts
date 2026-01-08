import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Создаём первого owner пользователя
  const ownerEmail = 'owner@example.com';
  const ownerPassword = 'Test123456!'; // В production использовать env variable

  // Хешируем пароль
  const passwordHash = await bcrypt.hash(ownerPassword, 10);

  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    create: {
      id: 'owner-001',
      email: ownerEmail,
      status: 'active',
      // Добавляем password_hash после миграции
    },
    update: {},
  });

  console.log('✅ Created owner user:', owner.email);

  // 2. Назначаем роль owner
  await prisma.userRole.upsert({
    where: {
      userId_roleCode: {
        userId: owner.id,
        roleCode: 'owner',
      },
    },
    create: {
      userId: owner.id,
      roleCode: 'owner',
      grantedAt: new Date(),
    },
    update: {},
  });

  console.log('✅ Assigned owner role');

  // 3. Добавляем согласие на обработку персональных данных
  await prisma.consent.create({
    data: {
      userId: owner.id,
      consentType: 'personal_data',
      granted: true,
      version: '2026-01-08',
      source: 'system',
      grantedAt: new Date(),
    },
  });

  console.log('✅ Created consent');

  // 4. Обновляем password_hash (после того как поле будет добавлено в миграции)
  await prisma.$executeRawUnsafe(
    `UPDATE users SET password_hash = $1 WHERE id = $2`,
    passwordHash,
    owner.id
  );

  console.log('✅ Set password hash');

  console.log('\n📝 Owner credentials:');
  console.log(`Email: ${ownerEmail}`);
  console.log(`Password: ${ownerPassword}`);
  console.log('\n⚠️  Change password in production!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n✅ Seed completed successfully');
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
