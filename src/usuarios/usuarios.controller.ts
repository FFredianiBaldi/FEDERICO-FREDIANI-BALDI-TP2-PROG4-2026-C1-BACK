import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Req } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RegistroAutenticacionDto } from '../autenticacion/dto/registro-autenticacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from '../guards/admin/admin.guard';
import type { Request } from 'express';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, AdminGuard)
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {

    return this.usuariosService.findOne(id);
  }

  @Get('username/:username')
    findByUsername(@Param('username') username: string, @Req() req: Request) {
      const authHeader = req.headers.authorization;
      return this.usuariosService.findByUsername(username, authHeader);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('foto_perfil'))
  update(@Param('id') id: string, @Body() updateUsuarioDto: Partial<RegistroAutenticacionDto>, @UploadedFile() fotoPerfil: Express.Multer.File)
  {
    return this.usuariosService.update(id, updateUsuarioDto, fotoPerfil);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, AdminGuard)
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(id);
  }
}
