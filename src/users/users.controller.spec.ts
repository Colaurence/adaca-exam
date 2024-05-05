import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            getUserById: jest.fn(),
            updateUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const mockUserData: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
      };
      const mockUser = {
        id: 'userId123',
        ...mockUserData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'createUser').mockResolvedValueOnce(mockUser as any);
      const result = await controller.createUser(mockUserData);
      expect(service.createUser).toHaveBeenCalledWith(mockUserData);
      expect(result).toEqual({ data: mockUser });
    });
  });

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      const userId = 'userId123';
      const mockUser = {
        id: userId,
        username: 'testuser',
        password: 'password123',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(service, 'getUserById').mockResolvedValueOnce(mockUser as any);
      const result = await controller.getUserById(userId);
      expect(service.getUserById).toHaveBeenCalledWith(userId);
      expect(result).toEqual({ data: mockUser });
    });
  });

  describe('updateUser', () => {
    it('should update a user by ID', async () => {
      const userId = 'userId123';
      const mockUserData: UpdateUserDto = {
        username: 'updatedUser',
      };
      const updatedUser = {
        id: userId,
        ...mockUserData,
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest
        .spyOn(service, 'updateUser')
        .mockResolvedValueOnce(updatedUser as any);
      const result = await controller.updateUser(userId, mockUserData);
      expect(service.updateUser).toHaveBeenCalledWith(userId, mockUserData);
      expect(result).toEqual({ data: updatedUser });
    });
  });
});
