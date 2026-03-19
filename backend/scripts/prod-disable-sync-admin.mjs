/* eslint-disable no-console */
import prisma from '../src/config/database.js';

(async () => {
  try {
    const email = 'sync.admin@pranijheightsindia.com';
    await prisma.user.updateMany({ where: { email }, data: { isActive: false } });
    console.log(`DISABLED ${email}`);
    await prisma.$disconnect();
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
})();
