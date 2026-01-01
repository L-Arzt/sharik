import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'grinuliana18@mail.ru';
  
  try {

    const deletedAdmin = await prisma.admin.delete({
      where: { email: email }
    });
    console.log(`🗑️  Deleted existing admin: ${deletedAdmin.email}`);
  } catch (error: any) {

    if (error.code !== 'P2025') {
      console.error('❌ Error deleting admin:', error);
      throw error;
    }
    console.log('ℹ️  No existing admin to delete');
  }


  const password = await bcryptjs.hash('GrinUliana200618', 10);
  
  const newAdmin = await prisma.admin.create({
    data: {
      email: email,
      password: password,
      name: 'Admin',
    },
  });
  
  console.log('✅ Admin created successfully:');
  console.log(`   Email: ${newAdmin.email}`);
  console.log(`   Name: ${newAdmin.name}`);
  console.log(`   ID: ${newAdmin.id}`);
}

main()
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });