import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { CreateEstadisticaDto } from './dto/create-estadistica.dto';
import { UpdateEstadisticaDto } from './dto/update-estadistica.dto';
import { JwtAuthGuard } from '../guards/jwt-auth/jwt-auth.guard';
import { AdminGuard } from '../guards/admin/admin.guard';

@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('publicaciones-por-usuario')
  @UseGuards(JwtAuthGuard, AdminGuard)
  publicacionesPorUsuario(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string
  ) {
    return this.estadisticasService.publicacionesPorUsuario(desde, hasta);
  }

  @Get('comentarios')
  @UseGuards(JwtAuthGuard, AdminGuard)
  comentarios(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string
  ) {
    return this.estadisticasService.comentarios(desde, hasta);
  }

  @Get('comentarios-por-publicacion')
  @UseGuards(JwtAuthGuard, AdminGuard)
  comentariosPorPublicacion(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string
  ) {
    return this.estadisticasService.comentariosPorPublicacion(desde, hasta);
  }

  @Get('ingreso-por-usuario')
  @UseGuards(JwtAuthGuard, AdminGuard)
  ingresoPorUsuario() {
    return this.estadisticasService.ingresoPorUsuario();
  }

  @Get('visitas-por-usuario')
  @UseGuards(JwtAuthGuard, AdminGuard)
  visitasPorUsuario() {
    return this.estadisticasService.visitasPorUsuario();
  }

  @Get('likes-por-dia')
  @UseGuards(JwtAuthGuard, AdminGuard)
  likesPorDia(
    @Query('desde') desde?: string,
    @Query('hasta') hasta?: string
  ) {
    return this.estadisticasService.likesPorDia(
      desde ? new Date(desde) : undefined,
      hasta ? new Date(hasta) : undefined
    );
  }
}
