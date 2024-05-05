import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User, Role } from '.prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: 'clvtju5640000buw3ax71tpa1',
        username: 'testuser',
        password: 'hashedpassword',
        role: Role.USER,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockLoginDto = { username: 'testuser', password: 'password' };

      jest
        .spyOn(authService['prisma'].user, 'findUnique')
        .mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

      const result = await authService.validateUser(mockLoginDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const mockLoginDto = {
        username: 'nonexistinguser',
        password: 'password',
      };

      jest
        .spyOn(authService['prisma'].user, 'findUnique')
        .mockResolvedValue(null);

      await expect(authService.validateUser(mockLoginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: 'clvtju5640000buw3ax71tpa2',
        username: 'testuser',
        password: 'hashedpassword',
        role: Role.USER,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockLoginDto = {
        username: 'testuser',
        password: 'invalidpassword',
      };

      jest
        .spyOn(authService['prisma'].user, 'findUnique')
        .mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.validateUser(mockLoginDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('generateToken', () => {
    it('should return user and token', async () => {
      const mockUser: User = {
        id: 'clvtju5640000buw3ax71tpa5',
        username: 'laurence',
        password: '123123123',
        role: Role.USER,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(authService['jwtService'], 'sign')
        .mockReturnValue('mockToken');

      const result = await authService.generateToken(mockUser);
      expect(result.user).toEqual(
        expect.objectContaining({
          id: mockUser.id,
          username: mockUser.username,
          role: mockUser.role,
          created_at: mockUser.created_at,
          updated_at: mockUser.updated_at,
        }),
      );
      expect(result.token).toEqual('mockToken');
    });
  });

  describe('verifyToken', () => {
    it('should return decoded payload if token is valid', async () => {
      const mockToken = 'mockToken';
      const mockDecodedPayload = { username: 'testuser', role: 'user', sub: 1 };

      jest
        .spyOn(authService['jwtService'], 'verify')
        .mockReturnValue(mockDecodedPayload);

      const result = await authService.verifyToken(mockToken);
      expect(result).toEqual(mockDecodedPayload);
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const mockToken = 'invalidToken';

      jest.spyOn(authService['jwtService'], 'verify').mockImplementation(() => {
        throw new Error('Invalid token');
      });

      await expect(authService.verifyToken(mockToken)).rejects.toThrowError(
        'Invalid token',
      );
    });
  });
});
