import { Controller, Get, Patch, Param, Body, UseGuards, NotFoundException, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('health')
  health() {
    return { ok: true };
  }

  // Listar todos los usuarios
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(@CurrentUser() user: any) {
    if (user.role !== 'admin') {
      throw new Error('Only admin can list users');
    }
    return this.usersService.getAll();
  }

  // Actualizar rol de un usuario
  @UseGuards(JwtAuthGuard)
  @Patch(':id/role')
  async updateRole(
    @Param('id') userId: string,
    @Body('role') role: string,
    @CurrentUser() currentUser: any,
  ) {
    if (currentUser.role !== 'admin') {
      throw new Error('Only admin can update roles');
    }
    return this.usersService.updateUserRole(userId, role);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/email')
  async updateEmail(
    @Param('id') userId: string,
    @Body('email') email: string,
    @CurrentUser() currentUser: any,
  ) {
    if (currentUser.role !== 'admin' && currentUser._id !== userId) {
      throw new Error('Only admin or the user themselves can update email');
    }
    return this.usersService.updateUserEmail(userId, email);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateDto: { name?: string; email?: string; role?: string },
  ) {
    const user = await this.usersService.updateUser(id, updateDto);
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return { message: '✅ Usuario actualizado', user };
  }

  //  Eliminar usuario
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    const deleted = await this.usersService.deleteUser(id);
    if (!deleted) throw new NotFoundException('Usuario no encontrado');
    return { message: '🗑 Usuario eliminado' };
  }

}