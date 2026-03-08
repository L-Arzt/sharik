/**
 * Обновляет в БД пути к фото: .jpg / .jpeg / .png → .webp
 * Запуск из папки sharik: npm run db:images-to-webp
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const images = await prisma.productImage.findMany({
    where: {
      OR: [
        { relativePath: { endsWith: '.jpg' } },
        { relativePath: { endsWith: '.jpeg' } },
        { relativePath: { endsWith: '.png' } },
      ],
    },
    select: { id: true, relativePath: true },
  });

  console.log(`Найдено записей с .jpg/.jpeg/.png: ${images.length}`);

  let updated = 0;
  for (const img of images) {
    if (!img.relativePath) continue;
    const newPath = img.relativePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    if (newPath === img.relativePath) continue;
    await prisma.productImage.update({
      where: { id: img.id },
      data: { relativePath: newPath },
    });
    updated++;
    if (updated <= 5) console.log('  ', img.relativePath, '→', newPath);
  }

  console.log(`Обновлено: ${updated}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
