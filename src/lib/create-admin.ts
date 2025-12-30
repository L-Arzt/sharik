// import { PrismaClient } from '@prisma/client';
// import bcryptjs from 'bcryptjs';

// const prisma = new PrismaClient();

// async function main() {
//   const password = await bcryptjs.hash('456456', 10);
//   await prisma.admin.create({
//     data: {
//       email: '456456@mail.ru',
//       password,
//       name: 'Admin',
//     },
//   });
//   console.log('✅ Admin created: admin@example.com / secure123');
// }

// main().then(() => prisma.$disconnect());
