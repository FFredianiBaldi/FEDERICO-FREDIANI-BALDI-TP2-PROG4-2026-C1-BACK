import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from 'src/schemas/usuario.schema';

@Module({
  controllers: [AutenticacionController],
  providers: [AutenticacionService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Usuario.name,
        schema: UsuarioSchema
      }
    ])
  ]
})
export class AutenticacionModule {}
