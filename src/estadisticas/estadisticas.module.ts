import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from '../schemas/comentario.schema';
import { Publicacion, PublicacionSchema } from '../schemas/publicacion.schema';
import { Usuario, UsuarioSchema } from '../schemas/usuario.schema';

@Module({
  controllers: [EstadisticasController],
  providers: [EstadisticasService],
  imports: [
    MongooseModule.forFeature([
          {
            name: Comentario.name,
            schema: ComentarioSchema
          },
          {
            name: Publicacion.name,
            schema:PublicacionSchema
          },
          {
            name: Usuario.name,
            schema:UsuarioSchema
          }
        ])
  ]
})
export class EstadisticasModule {}
