import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Role } from '.prisma/client';
import { Expose, Exclude } from 'class-transformer';

@Exclude()
export class BaseUserDto {
  @Expose()
  @IsNotEmpty()
  @IsString()
  username: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class CreateUserDto extends BaseUserDto {
  @Expose()
  role?: Role;
}

export class UpdateUserDto extends PartialType(BaseUserDto) {}
