import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User, Role } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            validateUser: jest.fn(),
            generateToken: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return user and token', async () => {
      const mockUser: User = {
        id: 'clvtju5640000buw3ax71tpa5',
        username: 'laurence',
        password: '123123123',
        role: Role.USER,
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockLoginDto: LoginDto = {
        username: 'laurence',
        password: '123123123',
      };
      const mockToken = 'mockToken';

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'generateToken').mockResolvedValue({
        user: mockUser,
        token: mockToken,
      });

      const result = await controller.login(mockLoginDto);
      expect(result.user).toEqual(mockUser);
      expect(result.token).toEqual(mockToken);
    });
  });
});
