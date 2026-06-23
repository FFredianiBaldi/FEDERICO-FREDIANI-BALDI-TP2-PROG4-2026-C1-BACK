import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../schemas/usuario.schema';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';

@Module({
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
  imports: [
    CloudinaryModule,
    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema
      }
    ])
  ]
})
export class AutenticacionModule {}
