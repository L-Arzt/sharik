import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdir, unlink } from 'fs/promises';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('sharp');


const __dirname = dirname(fileURLToPath(import.meta.url));
// Скрипт лежит в sharik/, папка с фото — sharik_with_data/downloaded_images
const ROOT = join(__dirname, '..', 'downloaded_images');
const SKIP_DIRS = ['uploads']; // не трогаем uploads/products (там уже webp)
const IMG_EXT = /\.(jpg|jpeg|png)$/i;

async function getAllImages(dir, list = []) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const e of entries) {
        const full = join(dir, e.name);
        if (e.isDirectory()) {
            if (!SKIP_DIRS.includes(e.name)) await getAllImages(full, list);
        } else if (e.isFile() && IMG_EXT.test(e.name)) {
            list.push(full);
        }
    }
    return list;
}

async function run() {
    const files = await getAllImages(ROOT);
    console.log(`Найдено JPG/JPEG/PNG: ${files.length}`);
    for (const src of files) {
        const webp = src.replace(IMG_EXT, '.webp');
        if (webp === src) continue;
        try {
            await sharp(src)
                .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toFile(webp);
            console.log('OK', webp);
            await unlink(src);
        } catch (err) {
            console.error('ERR', src, err.message);
        }
    }
}

run();