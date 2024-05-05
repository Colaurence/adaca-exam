import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Enrollment } from '.prisma/client';
import { Class } from '@prisma/client';
import { enrollmentTransformer } from './transformer/enrollment.transformer';
import {
  PaginateFn,
  PaginateOptions,
  PaginatedResult,
  paginator,
} from 'src/common/utils/paginator';

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
    const userData = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        Enrollment: {
          include: {
            class: true,
          },
        },
      },
    });

    const transformedData = await enrollmentTransformer(userData);

    const classes: Class[] =
      transformedData?.Enrollment?.map((enrollment) => enrollment.class) || [];

    return await paginator({ perPage: 10 })(
      this.prisma.class,
      { where: { id: { in: classes.map((c) => c.id) } } },
      options,
    );
  }
}
