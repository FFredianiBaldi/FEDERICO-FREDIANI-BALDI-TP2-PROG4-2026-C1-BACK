import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Query, DefaultValuePipe, ParseIntPipe } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(@Body() createPublicacionDto: CreatePublicacionDto, @UploadedFile() imagen: Express.Multer.File) {
    return this.publicacionesService.create(createPublicacionDto, imagen);
  }

  @Get()
  async findAll(@Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset: number, @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number, @Query('sortBy') sortBy?: string, @Query('order') order?: 'asc' | 'desc') {
    return this.publicacionesService.findAll(offset, limit, sortBy, order);
  }

  @Get('usuario/:usuarioId')
  async findByUsuario(
    @Param('usuarioId') usuarioId: string,
    @Query('offset', new DefaultValuePipe(0), ParseIntPipe) offset:number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit:number
  ) {
    return this.publicacionesService.findByUsuario(usuarioId, offset, limit);
  }

  @Post('like')
  async like(@Body('usuarioId') usuarioId: string, @Body('id') id:string) {
    return this.publicacionesService.like(usuarioId, id);
  }

  @Delete('like')
  async dislike(@Body('usuarioId') usuarioId: string, @Body('id') id:string) {
    return this.publicacionesService.dislike(usuarioId, id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicacionesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePublicacioneDto: UpdatePublicacioneDto) {
    return this.publicacionesService.update(+id, updatePublicacioneDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Body('usuarioId')usuarioId: string) {
    return this.publicacionesService.remove(id, usuarioId);
  }
}
