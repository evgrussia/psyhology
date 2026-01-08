// Seed данные для dev/test окружения
// Запуск: npx prisma db seed (или через package.json)

import { PrismaClient } from '../src/infrastructure/persistence/prisma/generated';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Начинаем seeding...');

  // 1. Роли (Roles)
  console.log('📝 Создаём роли...');
  await prisma.role.upsert({
    where: { code: 'owner' },
    update: {},
    create: {
      code: 'owner',
      scope: 'admin',
    },
  });

  await prisma.role.upsert({
    where: { code: 'assistant' },
    update: {},
    create: {
      code: 'assistant',
      scope: 'admin',
    },
  });

  await prisma.role.upsert({
    where: { code: 'editor' },
    update: {},
    create: {
      code: 'editor',
      scope: 'product',
    },
  });

  await prisma.role.upsert({
    where: { code: 'client' },
    update: {},
    create: {
      code: 'client',
      scope: 'product',
    },
  });

  // 2. Темы (Topics)
  console.log('📚 Создаём темы...');
  const topics = [
    { code: 'anxiety', title: 'Тревога' },
    { code: 'burnout', title: 'Выгорание' },
    { code: 'relationships', title: 'Отношения' },
    { code: 'boundaries', title: 'Границы' },
    { code: 'selfesteem', title: 'Самооценка' },
  ];

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { code: topic.code },
      update: {},
      create: {
        code: topic.code,
        title: topic.title,
        isActive: true,
      },
    });
  }

  console.log('✅ Seeding завершён!');
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
