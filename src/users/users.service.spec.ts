import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

jest.mock('bcryptjs', () => ({
  hash: jest
    .fn()
    .mockResolvedValue(
      '$2a$10$nljVzQE4QdnVx7u0cm12A.zBln5xZiUbL3gcMYlTBWLDplSNToBIa',
    ),
}));

jest.mock('./transformer/user.transformer', () => ({
  userTransformer: jest.fn((user) => ({
    id: user.id,
    username: user.username,
    created_at: user.created_at,
    updated_at: user.updated_at,
  })),
}));

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUserData: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const hashedPassword =
        '$2a$10$nljVzQE4QdnVx7u0cm12A.zBln5xZiUbL3gcMYlTBWLDplSNToBIa';
      const mockUser = {
        id: 'userId123',
        ...mockUserData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(prismaService.user, 'create')
        .mockResolvedValueOnce(mockUser as any);

      const result = await service.createUser(mockUserData);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          ...mockUserData,
          password: hashedPassword,
        },
      });
      expect(result).toMatchObject({
        id: mockUser.id,
        username: mockUser.username,
        created_at: mockUser.created_at,
        updated_at: mockUser.updated_at,
      });
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const userId = 'userId123';
      const mockUser = {
        id: userId,
        username: 'testuser',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValueOnce(mockUser as any);

      const result = await service.getUserById(userId);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const userId = 'nonExistingUserId';
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValueOnce(null);

      await expect(service.getUserById(userId)).rejects.toThrowError(
        NotFoundException,
      );
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });
  });
});
