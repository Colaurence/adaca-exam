import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Class } from '.prisma/client';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import {
  PaginateFn,
  PaginateOptions,
  PaginatedResult,
  paginator,
} from 'src/common/utils/paginator';

const paginate: PaginateFn = paginator({ perPage: 5 });

@Injectable()
export class ClassService {
  constructor(private prisma: PrismaService) {}

  async createClass(
    { name, description }: CreateClassDto,
    userRole: string,
  ): Promise<Class> {
    this.validateUserRole(userRole);

    try {
      return await this.prisma.class.create({
        data: { name, description },
      });
    } catch (error) {
      this.handlePrismaError(error, 'Failed to create class');
    }
  }

  async getAllClasses(
    options: PaginateOptions,
  ): Promise<PaginatedResult<Class[]>> {
    return await paginate(this.prisma.class, undefined, options);
  }

  async getClassById(classId: string): Promise<Class | null> {
    const classItem = await this.prisma.class.findUnique({
      where: { id: classId },
    });
    if (!classItem) {
      throw new NotFoundException('Class not found.');
    }
    return classItem;
  }

  async updateClass(
    classId: string,
    classData: UpdateClassDto,
    userRole: string,
  ): Promise<Class | null> {
    this.validateUserRole(userRole);

    try {
      return await this.prisma.class.update({
        where: { id: classId },
        data: classData,
      });
    } catch (error) {
      this.handlePrismaError(error, 'Failed to update class');
    }
  }

  async deleteClass(classId: string, userRole: string): Promise<Class | null> {
    this.validateUserRole(userRole);

    try {
      return await this.prisma.class.delete({
        where: { id: classId },
      });
    } catch (error) {
      this.handlePrismaError(error, 'Failed to delete class');
    }
  }

  private validateUserRole(userRole: string): void {
    if (userRole !== 'ADMIN') {
      throw new UnauthorizedException(
        `Only ADMIN users can perform this action.`,
      );
    }
  }

  private handlePrismaError(error: any, errorMessage: string): void {
    if (error.code === 'P2002' && error.meta?.target?.includes('name')) {
      throw new BadRequestException('Class name must be unique.');
    }
    throw new BadRequestException(
      `${errorMessage}: ${JSON.stringify(error.message)}`,
    );
  }
}
