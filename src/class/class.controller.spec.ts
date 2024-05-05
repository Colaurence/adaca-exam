import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from './class.controller';
import { ClassService } from './class.service';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { Class } from '.prisma/client';
import { extractUserRole } from '../common/utils/jwt.utils';

jest.mock('../common/utils/jwt.utils');

describe('ClassController', () => {
  let controller: ClassController;
  let classService: ClassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassController],
      providers: [
        {
          provide: ClassService,
          useValue: {
            createClass: jest.fn(),
            getAllClasses: jest.fn(),
            getClassById: jest.fn(),
            updateClass: jest.fn(),
            deleteClass: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ClassController>(ClassController);
    classService = module.get<ClassService>(ClassService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createClass', () => {
    it('should create a new class', async () => {
      (extractUserRole as jest.Mock).mockReturnValue('admin');
      const classData: CreateClassDto = {
        name: 'Mathematics',
        description: 'mathematics class for high school students',
      };
      const mockClass: Class = {
        id: 'clvti2qjo0000l9oyh6zy342l',
        name: 'Mathematics',
        description: 'mathematics class for high school students',
        created_at: new Date(),
        updated_at: new Date(),
      };

      jest.spyOn(classService, 'createClass').mockResolvedValue(mockClass);

      const result = await controller.createClass(classData, {} as any);
      expect(result).toEqual(mockClass);
    });
  });

  describe('getClassById', () => {
    it('should return a class by ID', async () => {
      const mockClass: Class = {
        id: 'clvti2qjo0000l9oyh6zy342l',
        name: 'Mathematics',
        description: 'mathematics class for high school students',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockId = 'mockId';

      jest.spyOn(classService, 'getClassById').mockResolvedValue(mockClass);

      const result = await controller.getClassById(mockId);
      expect(result).toEqual(mockClass);
    });
  });

  describe('updateClass', () => {
    it('should update a class by ID', async () => {
      (extractUserRole as jest.Mock).mockReturnValue('admin');
      const classData: UpdateClassDto = {
        name: 'Mathematics',
        description: 'mathematics class for high school students',
      };
      const mockClass: Class = {
        id: 'clvti2qjo0000l9oyh6zy342l',
        name: 'Mathematics',
        description: 'mathematics class for high school students',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockId = 'mockId';

      jest.spyOn(classService, 'updateClass').mockResolvedValue(mockClass);

      const result = await controller.updateClass(mockId, classData, {} as any);
      expect(result).toEqual(mockClass);
    });
  });

  describe('deleteClass', () => {
    it('should delete a class by ID', async () => {
      (extractUserRole as jest.Mock).mockReturnValue('admin');
      const mockClass: Class = {
        id: 'clvti2qjo0000l9oyh6zy342l',
        name: 'Mathematics',
        description: 'mathematics class for high school students',
        created_at: new Date(),
        updated_at: new Date(),
      };
      const mockId = 'mockId';

      jest.spyOn(classService, 'deleteClass').mockResolvedValue(mockClass);

      const result = await controller.deleteClass(mockId, {} as any);
      expect(result).toEqual(mockClass);
    });
  });
});
