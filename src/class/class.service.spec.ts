import { Test, TestingModule } from '@nestjs/testing';
import { ClassService } from './class.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';

describe('ClassesService', () => {
  let service: ClassService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClassService, PrismaService],
    }).compile();

    service = module.get<ClassService>(ClassService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createClass', () => {
    it('should create a new class', async () => {
      const mockCreateClassDto = {
        name: 'Mathematics',
        description: 'mathematics class for high school students',
      };
      const mockUserRole = 'ADMIN';

      const createSpy = jest
        .spyOn(prismaService.class, 'create')
        .mockResolvedValueOnce({
          id: 'clvti2qjo0000l9oyh6zy342l',
          name: mockCreateClassDto.name,
          description: mockCreateClassDto.description,
          created_at: new Date(),
          updated_at: new Date(),
        });

      const result = await service.createClass(
        mockCreateClassDto,
        mockUserRole,
      );

      expect(createSpy).toHaveBeenCalledWith({ data: mockCreateClassDto });
      expect(result).toEqual(
        expect.objectContaining({
          id: 'testId',
          ...mockCreateClassDto,
        }),
      );
    });

    it('should throw UnauthorizedException if user role is not ADMIN', async () => {
      const mockCreateClassDto = {
        name: 'Test Class',
        description: 'Test Description',
      };
      const mockUserRole = 'USER';

      await expect(
        service.createClass(mockCreateClassDto, mockUserRole),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('updateClass', () => {
    it('should update a class by ID', async () => {
      const classId = 'clvti2qjo0000l9oyh6zy342l';
      const mockUpdateClassDto = {
        name: 'Updated Mathematics',
        description: 'Updated mathematics class for high school students',
      };
      const mockUserRole = 'ADMIN';

      const updateSpy = jest
        .spyOn(prismaService.class, 'update')
        .mockResolvedValueOnce({
          id: classId,
          ...mockUpdateClassDto,
          created_at: new Date(),
          updated_at: new Date(),
        });

      const result = await service.updateClass(
        classId,
        mockUpdateClassDto,
        mockUserRole,
      );

      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: classId },
        data: mockUpdateClassDto,
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: classId,
          ...mockUpdateClassDto,
        }),
      );
    });

    it('should throw UnauthorizedException if user role is not ADMIN', async () => {
      const classId = 'clvti2qjo0000l9oyh6zy342l';
      const mockUpdateClassDto = {
        name: 'Updated Mathematics',
        description: 'Updated mathematics class for high school students',
      };
      const mockUserRole = 'USER';

      await expect(
        service.updateClass(classId, mockUpdateClassDto, mockUserRole),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });

  describe('deleteClass', () => {
    it('should delete a class by ID', async () => {
      const classId = 'clvti2qjo0000l9oyh6zy342l';
      const mockUserRole = 'ADMIN';

      const deleteSpy = jest
        .spyOn(prismaService.class, 'delete')
        .mockResolvedValueOnce({
          id: classId,
          name: 'Mathematics',
          description: 'mathematics class for high school students',
          created_at: new Date(),
          updated_at: new Date(),
        });

      const result = await service.deleteClass(classId, mockUserRole);

      expect(deleteSpy).toHaveBeenCalledWith({ where: { id: classId } });

      expect(result).toEqual(
        expect.objectContaining({
          id: classId,
          name: 'Mathematics',
          description: 'mathematics class for high school students',
        }),
      );
    });

    it('should throw UnauthorizedException if user role is not ADMIN', async () => {
      const classId = 'clvti2qjo0000l9oyh6zy342l';
      const mockUserRole = 'USER';

      await expect(
        service.deleteClass(classId, mockUserRole),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
