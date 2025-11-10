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
  @ApiCreatedResponse({
    description: 'User created successfully',
    schema: {
      example: {
        id: 1,
        username: 'ahmed',
        email: 'ahmed@example.com',
        image: 'https://example.com/avatar.png',
        nickname: 'Ahmed',
        phone: '+201001234567',
        createdAt: '2025-11-10T20:00:00.000Z',
        updatedAt: '2025-11-10T20:00:00.000Z'
      }
    }
  })
  create(@Body() dto: CreateUserAdminDto) {
    return this.usersService.create(dto);
  }

  // Read (list)
  @Get()
  @ApiOperation({ summary: 'List users' })
  @ApiOkResponse({
    description: 'Users fetched successfully',
    schema: {
      example: [
        {
          id: 1,
          username: 'ahmed',
          email: 'ahmed@example.com',
          image: 'https://example.com/avatar.png',
          nickname: 'Ahmed',
          phone: '+201001234567',
          createdAt: '2025-11-10T20:00:00.000Z',
          updatedAt: '2025-11-10T20:00:00.000Z'
        }
      ]
    }
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by id' })
  @ApiOkResponse({
    description: 'User fetched successfully',
    schema: {
      example: {
        id: 1,
        username: 'ahmed',
        email: 'ahmed@example.com',
        image: 'https://example.com/avatar.png',
        nickname: 'Ahmed',
        phone: '+201001234567',
        createdAt: '2025-11-10T20:00:00.000Z',
        updatedAt: '2025-11-10T20:00:00.000Z'
      }
    }
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user by id' })
  @ApiOkResponse({
    description: 'User updated successfully',
    schema: {
      example: {
        id: 1,
        username: 'ahmed',
        email: 'ahmed@example.com',
        image: 'https://example.com/avatar.png',
        nickname: 'Ahmed Updated',
        phone: '+201001234567',
        createdAt: '2025-11-10T20:00:00.000Z',
        updatedAt: '2025-11-10T21:00:00.000Z'
      }
    }
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user by id' })
  @ApiOkResponse({
    description: 'User deleted successfully',
    schema: { example: { id: 1, username: 'ahmed', email: 'ahmed@example.com' } }
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // (No extra endpoints for users as requested)
}
