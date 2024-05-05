import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { Class } from '.prisma/client';
import { ClassService } from './class.service';
import { AuthGuard } from '../auth/auth.guard';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';
import { extractUserRole } from 'src/common/utils/jwt.utils';
import { PaginateOptions, PaginatedResult } from 'src/common/utils/paginator';

@Controller('api/v1/classes')
export class ClassController {
  constructor(private classService: ClassService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createClass(
    @Body() classData: CreateClassDto,
    @Req() req,
  ): Promise<Class> {
    const userRole = extractUserRole(req);
    if (!userRole) {
      throw new UnauthorizedException('Invalid token or missing role');
    }
    return this.classService.createClass(classData, userRole);
  }

  @Get()
  async getAllClasses(
    @Query() options: PaginateOptions,
  ): Promise<PaginatedResult<Class[]>> {
    return this.classService.getAllClasses(options);
  }

  @Get(':id')
  async getClassById(@Param('id') id: string): Promise<Class | null> {
    return this.classService.getClassById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  async updateClass(
    @Param('id') id: string,
    @Body() classData: UpdateClassDto,
    @Req() req,
  ): Promise<Class | null> {
    const userRole = extractUserRole(req);
    if (!userRole) {
      throw new UnauthorizedException('Invalid token or missing role');
    }
    return this.classService.updateClass(id, classData, userRole);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteClass(
    @Param('id') id: string,
    @Req() req,
  ): Promise<Class | null> {
    const userRole = extractUserRole(req);
    if (!userRole) {
      throw new UnauthorizedException('Invalid token or missing role');
    }
    return this.classService.deleteClass(id, userRole);
  }
}
