import {
  Controller,
  Get,
  UseGuards,
  Param,
  ParseIntPipe,
  NotFoundException,
  HttpCode,
  HttpStatus,
  Put,
  Body,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard,RolesGuard)
  @Roles('admin')
  @Get()
  async getUserAll() {
    const users = await this.usersService.findAll();
    if (!users.length) {
      throw new NotFoundException('No users found');
    }
    return users;
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOneByField('id', id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = await this.usersService.findOneByField('id', id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return await this.usersService.updateUser(user, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOneByField('id', id);
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return this.usersService.remove(user);
  }
}
