import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '.prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { userTransformer } from './transformer/user.transformer';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    try {
      const createdUser = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });
      return await userTransformer(createdUser);
    } catch (error) {
      this.handlePrismaError(error, 'Failed to create user');
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    return await userTransformer(user);
  }

  async updateUser(
    userId: string,
    userData: UpdateUserDto,
  ): Promise<User | null> {
    try {
      const updatedUser = await this.prisma.user.update({
        where: { id: userId },
        data: userData,
      });
      return await userTransformer(updatedUser);
    } catch (error) {
      this.handlePrismaError(error, 'Failed to update user');
    }
  }

  async deleteUser(userId: string): Promise<User | null> {
    try {
      const deletedUser = await this.prisma.user.delete({
        where: { id: userId },
      });
      return await userTransformer(deletedUser);
    } catch (error) {
      this.handlePrismaError(error, 'Failed to delete user');
    }
  }

  private handlePrismaError(error: any, errorMessage: string): void {
    if (error.code === 'P2002' && error.meta?.target?.includes('username')) {
      throw new BadRequestException('Username already exists.');
    }
    throw new BadRequestException(
      `${errorMessage}: ${JSON.stringify(error.message)}`,
    );
  }
}
