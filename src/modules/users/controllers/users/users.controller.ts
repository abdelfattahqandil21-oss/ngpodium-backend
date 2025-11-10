import { Controller, Get, Param, Patch, Delete, Body, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiCreatedResponse } from '@nestjs/swagger';
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
  @ApiCreatedResponse({ description: 'User created successfully' })
  create(@Body() dto: CreateUserAdminDto) {
    return this.usersService.create(dto);
  }

  // Read (list)
  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({ description: 'Users fetched successfully' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({ description: 'User fetched successfully' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiOkResponse({ description: 'User updated successfully' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiOkResponse({ description: 'User deleted successfully' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // (No extra endpoints for users as requested)
}
