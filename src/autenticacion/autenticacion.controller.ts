import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { LoginAutenticacionDto } from './dto/login-autenticacion.dto';
import { RegistroAutenticacionDto } from './dto/registro-autenticacion.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('autenticacion')
export class AutenticacionController {
  constructor(private readonly autenticacionService: AutenticacionService) {}

  @Post('login')
  async login(@Body() loginAutenticacionDto: LoginAutenticacionDto) {
    return this.autenticacionService.login(loginAutenticacionDto);
  }

  @Post('registro')
  @UseInterceptors(FileInterceptor('foto_perfil'))
  async registro(@Body() registroAutenticacionDto: RegistroAutenticacionDto, @UploadedFile() fotoPerfil: Express.Multer.File) {
    return this.autenticacionService.registro(registroAutenticacionDto, fotoPerfil);
  }

  @Get()
  findAll() {
    return this.autenticacionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.autenticacionService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.autenticacionService.remove(+id);
  }
}
