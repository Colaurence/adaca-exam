import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '.prisma/client';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() userData: CreateUserDto): Promise<{ data: User }> {
    const user = await this.usersService.createUser(userData);
    return { data: user };
  }

  @Get(':id')
  async getUserById(
    @Param('id') userId: string,
  ): Promise<{ data: User | null }> {
    const user = await this.usersService.getUserById(userId);
    return { data: user };
  }

  @Put(':id')
  async updateUser(
    @Param('id') userId: string,
    @Body() userData: UpdateUserDto,
  ): Promise<{ data: User | null }> {
    const user = await this.usersService.updateUser(userId, userData);
    return { data: user };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') userId: string): Promise<{ data: null }> {
    await this.usersService.deleteUser(userId);
    return { data: null };
  }
}
