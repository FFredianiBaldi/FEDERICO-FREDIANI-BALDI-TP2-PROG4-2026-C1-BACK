import { Module } from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { PublicacionesController } from './publicaciones.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Publicacion, PublicacionSchema } from 'src/schemas/publicacion.schema';
import { Usuario, UsuarioSchema } from 'src/schemas/usuario.schema';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: Publicacion.name,
        schema: PublicacionSchema
      }
    ]),
    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema
      }
    ])
  ]
})
export class PublicacionesModule {}
