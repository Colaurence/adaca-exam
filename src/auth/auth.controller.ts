import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ user: User; token: string }> {
    const user = await this.authService.validateUser(loginDto);
    const { user: loggedInUser, token } =
      await this.authService.generateToken(user);
    return { user: loggedInUser, token };
  }
}
