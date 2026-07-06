import { Module } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasController } from './estadisticas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from '../schemas/comentario.schema';
import { Publicacion, PublicacionSchema } from '../schemas/publicacion.schema';

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
          }
        ])
  ]
})
export class EstadisticasModule {}
