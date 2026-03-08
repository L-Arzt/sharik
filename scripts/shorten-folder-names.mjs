import { PrismaClient } from '@prisma/client';
import { readdir, rename } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();
const IMAGES_ROOT = join(__dirname, '..', '..', 'downloaded_images');

const SKIP_DIRS = ['uploads'];

// Генератор коротких имён
let counter = 1;
function generateShortName() {
    return `img_${String(counter++).padStart(3, '0')}`;
}

async function main() {
    const entries = await readdir(IMAGES_ROOT, { withFileTypes: true });
    const folders = entries.filter(e => e.isDirectory() && !SKIP_DIRS.includes(e.name));

    console.log(`Найдено папок: ${folders.length}`);

    const renameMap = new Map(); // старое имя → новое имя

    for (const folder of folders) {
        const oldName = folder.name;
        const oldPath = join(IMAGES_ROOT, oldName);

        // Если папка уже короткая (например, uploads или уже переименованные), пропускаем
        if (oldName.length <= 20) {
            console.log(`SKIP (уже короткое имя): ${oldName}`);
            continue;
        }

        const newName = generateShortName();
        const newPath = join(IMAGES_ROOT, newName);

        // Переименовываем папку
        try {
            await rename(oldPath, newPath);
            renameMap.set(oldName, newName);
            console.log(`RENAME: ${oldName} → ${newName}`);
        } catch (err) {
            console.error(`ERR (не удалось переименовать): ${oldName}`, err.message);
        }
    }

    console.log(`\nПереименовано папок: ${renameMap.size}`);

    if (renameMap.size === 0) {
        console.log('Нечего обновлять в БД');
        return;
    }

    // Обновляем пути в БД
    console.log('\nОбновление путей в БД...');
    const images = await prisma.productImage.findMany({
        select: { id: true, relativePath: true },
    });

    let updated = 0;
    for (const img of images) {
        if (!img.relativePath) continue;

        // Извлекаем имя папки из пути
        const parts = img.relativePath.split(/[\\/]/);
        if (parts.length < 2) continue;

        const folderName = parts[0];
        const newFolderName = renameMap.get(folderName);

        if (newFolderName) {
            parts[0] = newFolderName;
            const newPath = parts.join('/');

            await prisma.productImage.update({
                where: { id: img.id },
                data: { relativePath: newPath },
            });

            updated++;
            if (updated <= 5) {
                console.log(`  ${img.relativePath} → ${newPath}`);
            }
        }
    }

    console.log(`Обновлено записей в БД: ${updated}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
