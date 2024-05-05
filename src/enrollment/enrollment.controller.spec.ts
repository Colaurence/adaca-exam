import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentController } from './enrollment.controller';
import { EnrollmentService } from './enrollment.service';

describe('EnrollmentController', () => {
  let controller: EnrollmentController;
  let service: EnrollmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnrollmentController],
      providers: [
        {
          provide: EnrollmentService,
          useValue: {
            createEnrollment: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<EnrollmentController>(EnrollmentController);
    service = module.get<EnrollmentService>(EnrollmentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      jest
        .spyOn(service, 'createEnrollment')
        .mockResolvedValueOnce(mockEnrollment);
      const result = await controller.createEnrollment(userId, classId);
      expect(service.createEnrollment).toHaveBeenCalledWith(userId, classId);
      expect(result).toEqual(mockEnrollment);
    });
  });
});
