const { PrismaClient, Prisma, Role } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { JwtService } = require('@nestjs/jwt');
const dotenv = require('dotenv');

dotenv.config();

const prisma = new PrismaClient();
const jwtService = new JwtService();

const seedAdminUser = async () => {
  const userId = uuidv4();
  const userData = {
    id: userId,
    username: 'admin',
    password: await bcrypt.hash('admin123', 10),
    role: Role.ADMIN,
    created_at: new Date(),
    updated_at: new Date(),
  };

  try {
    const createdUser = await prisma.user.create({ data: userData });
    const payload = { username: createdUser.username, sub: createdUser.id };
    const token = jwtService.sign(payload, { secret: process.env.JWT_SECRET });
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
};

seedAdminUser();
