import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(@Body() createComentarioDto: CreateComentarioDto, @UploadedFile() imagen: Express.Multer.File) {
    return this.comentariosService.create(createComentarioDto, imagen);
  }

  @Get()
  findAll() {
    return this.comentariosService.findAll();
  }

  @Get(':publicacionId')
  findOne(
    @Param('publicacionId') publicacionId: string,
    @Query('offset') offset = 0,
    @Query('limit') limit = 10,
    @Query('order') order: 'asc' | 'desc' = 'desc'
  ) {
    return this.comentariosService.findPostComments(
      publicacionId,
      Number(offset),
      Number(limit),
      order
    );
  }

  @Patch(':comentarioId/:usuarioId')
  @UseInterceptors(FileInterceptor('imagen'))
  async update(@Param('comentarioId') comentarioId: string, @Param('usuarioId') usuarioId: string, @Body() updateComentarioDto: Partial<CreateComentarioDto>, @UploadedFile() imagen?: Express.Multer.File) {
    return this.comentariosService.update(comentarioId, usuarioId, updateComentarioDto, imagen);
  }

  @Delete(':comentarioId/remove/:usuarioId')
  async remove(
    @Param('comentarioId') comentarioId: string,
    @Param('usuarioId') usuarioId: string
  ) {
    return this.comentariosService.remove(comentarioId, usuarioId);
  }
}
