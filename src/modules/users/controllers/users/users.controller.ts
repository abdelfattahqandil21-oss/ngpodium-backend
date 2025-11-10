import { Controller, Get, Param, Patch, Delete, Body, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody } from '@nestjs/swagger';
import { UsersService } from '../../services/users/users.service';
import { UpdateUserDto } from '../../../users/dto/update-user.dto';
import { CreateUserAdminDto } from '../../../users/dto/create-user-admin.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Create
  @Post()
  @ApiOperation({ summary: 'Create user (admin only)' })
  @ApiBody({ type: CreateUserAdminDto })
  create(@Body() dto: CreateUserAdminDto) {
    return this.usersService.create(dto);
  }

  // Read (list)
  @Get()
  @ApiOperation({ summary: 'List users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiBody({ type: UpdateUserDto })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // (No extra endpoints for users as requested)
}
