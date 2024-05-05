// enrollment.controller.ts
import { Controller, Post, Param, UseGuards, Get, Req } from '@nestjs/common';
import { Enrollment } from '.prisma/client';
import { EnrollmentService } from './enrollment.service';
import { AuthGuard } from '../auth/auth.guard';
import { extractUserId } from 'src/common/utils/jwt.utils';
import { Class, User } from '@prisma/client';
import { PaginateOptions, PaginatedResult } from 'src/common/utils/paginator';

@Controller('api/v1/enrollments')
export class EnrollmentController {
  constructor(private enrollmentService: EnrollmentService) {}

  @Post(':userId/:classId')
  @UseGuards(AuthGuard)
  async createEnrollment(
    @Param('userId') userId: string,
    @Param('classId') classId: string,
  ): Promise<Enrollment> {
    return this.enrollmentService.createEnrollment(userId, classId);
  }

  @Get('user/classes')
  @UseGuards(AuthGuard)
  async getUserClasses(@Req() req): Promise<PaginatedResult<Class[]>> {
    const userId = extractUserId(req);
    const options: PaginateOptions = {}; // Define your pagination options here if needed
    return this.enrollmentService.getUserClasses(userId, options);
  }
}
