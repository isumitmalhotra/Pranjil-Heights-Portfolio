/* eslint-disable no-console */
import process from 'process';
import bcrypt from 'bcryptjs';
import prisma from '../src/config/database.js';

const email = (process.env.ADMIN_BOOTSTRAP_EMAIL || '').trim().toLowerCase();
const password = process.env.ADMIN_BOOTSTRAP_PASSWORD || '';
const name = process.env.ADMIN_BOOTSTRAP_NAME || 'Sync Admin';

if (!email || !password) {
  console.error('Missing ADMIN_BOOTSTRAP_EMAIL or ADMIN_BOOTSTRAP_PASSWORD');
  process.exit(1);
}

if (password.length < 10) {
  console.error('Password too short. Use at least 10 characters.');
  process.exit(1);
}

(async () => {
  try {
    const hashed = await bcrypt.hash(password, 12);
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: {
          password: hashed,
          role: 'SUPER_ADMIN',
          isActive: true,
          name: existing.name || name,
        },
      });
      console.log(`UPDATED ${email}`);
    } else {
      await prisma.user.create({
        data: {
          email,
          password: hashed,
          name,
          role: 'SUPER_ADMIN',
          isActive: true,
        },
      });
      console.log(`CREATED ${email}`);
    }

    await prisma.$disconnect();
  } catch (err) {
    console.error(err.message || err);
    process.exit(1);
  }
})();
