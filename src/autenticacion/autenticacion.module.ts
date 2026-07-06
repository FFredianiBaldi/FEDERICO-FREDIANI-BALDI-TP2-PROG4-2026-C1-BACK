import { Module } from '@nestjs/common';
import { AutenticacionService } from './autenticacion.service';
import { AutenticacionController } from './autenticacion.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../schemas/usuario.schema';

import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

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
    ]),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {expiresIn: '15m'}
      })
    })
  ]
})
export class AutenticacionModule {}
