import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Enrollment } from '.prisma/client';
import { Class } from '@prisma/client';
import {
  PaginateFn,
  PaginateOptions,
  PaginatedResult,
  paginator,
} from '../common/utils/paginator';

const paginate: PaginateFn = paginator({ perPage: 5 });

@Injectable()
export class EnrollmentService {
  constructor(private prisma: PrismaService) {}

  async createEnrollment(userId: string, classId: string): Promise<Enrollment> {
    return this.prisma.enrollment.create({
      data: {
        userId,
        classId,
      },
    });
  }

  async getUserClasses(
    userId: string,
    options: PaginateOptions,
  ): Promise<PaginatedResult<Class[]>> {
    return await paginate(
      this.prisma.class,
      {
        where: {
          Enrollment: {
            every: {
              userId,
            },
          },
        },
      },
      options,
    );
  }
}
