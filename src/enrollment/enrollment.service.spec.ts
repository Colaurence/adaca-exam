import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentService } from './enrollment.service';
import { PrismaService } from '../prisma/prisma.service';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentService, PrismaService],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createEnrollment', () => {
    it('should create a new enrollment', async () => {
      const userId = 'user123';
      const classId = 'class456';
      const mockEnrollment = {
        id: 'enrollmentId123',
        userId,
        classId,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const createSpy = jest
        .spyOn(prismaService.enrollment, 'create')
        .mockResolvedValueOnce(mockEnrollment as any);
      const result = await service.createEnrollment(userId, classId);
      expect(createSpy).toHaveBeenCalledWith({
        data: { userId, classId },
      });
      expect(result).toEqual(mockEnrollment);
    });
  });
});
