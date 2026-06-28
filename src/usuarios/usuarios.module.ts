import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../schemas/usuario.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { Publicacion, PublicacionSchema } from 'src/schemas/publicacion.schema';

@Module({
  controllers: [UsuariosController],
  providers: [UsuariosService],
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema
      },
      {
        name: Publicacion.name,
        schema: PublicacionSchema
      }
    ])
  ]
})
export class UsuariosModule {}
