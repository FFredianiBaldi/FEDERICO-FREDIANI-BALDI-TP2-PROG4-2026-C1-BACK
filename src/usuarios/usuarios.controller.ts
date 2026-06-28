import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { RegistroAutenticacionDto } from '../autenticacion/dto/registro-autenticacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return this.usuariosService.create(createUsuarioDto);
  }

  @Get()
  findAll() {
    return this.usuariosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usuariosService.findOne(id);
  }

  @Get('username/:username')
    findByUsername(@Param('username') username: string) {
      return this.usuariosService.findByUsername(username);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('foto_perfil'))
  update(@Param('id') id: string, @Body() updateUsuarioDto: Partial<RegistroAutenticacionDto>, @UploadedFile() fotoPerfil: Express.Multer.File)
  {
    return this.usuariosService.update(id, updateUsuarioDto, fotoPerfil);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usuariosService.remove(+id);
  }
}
