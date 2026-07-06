import { Module } from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { CloudinaryModule } from '../../cloudinary/cloudinary.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Comentario, ComentarioSchema } from '../../schemas/comentario.schema';
import { Usuario, UsuarioSchema } from '../../schemas/usuario.schema';

@Module({
  controllers: [ComentariosController],
  providers: [ComentariosService],
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: Comentario.name,
        schema: ComentarioSchema
      },
      {
        name: Usuario.name,
        schema:UsuarioSchema
      }
    ])
  ]
})
export class ComentariosModule {}
