import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAutenticacionDto } from './dto/login-autenticacion.dto';
import { RegistroAutenticacionDto } from './dto/registro-autenticacion.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from 'src/schemas/usuario.schema';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AutenticacionService {

  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<UsuarioDocument>
  ) {}

  async login(loginAutenticacionDto: LoginAutenticacionDto) {

    if(!loginAutenticacionDto.identificador) {
      throw new BadRequestException(
        'Se requiere email o username'
      )
    }

    const usuario = await this.usuarioModel.findOne({
      $or: [
        {email: loginAutenticacionDto.identificador},
        {username: loginAutenticacionDto.identificador}
      ]
    });

    if(!usuario) {
      throw new UnauthorizedException(
        'Credenciales invalidas'
      )
    }

    const passwordValida = await bcrypt.compare(
      loginAutenticacionDto.password,
      usuario.password
    )

    if(!passwordValida) {
      throw new UnauthorizedException(
        'Credenciales invalidas'
      )
    }

    return usuario;

  }

  async registro(registroAutenticacionDto: RegistroAutenticacionDto, fotoPerfil: Express.Multer.File) {
    const usuarioExistente = await this.usuarioModel.findOne({
      $or: [
        {email: registroAutenticacionDto.email},
        {username: registroAutenticacionDto.username}
      ]
    });

    if(usuarioExistente) {
      throw new Error('El usuario ya existe');
    }

    const passwordHash = await bcrypt.hash(registroAutenticacionDto.password, 10)

    const usuario = await this.usuarioModel.create({
      ...registroAutenticacionDto,
      password: passwordHash,
      foto_perfil: fotoPerfil?.filename ?? null
    });

    return usuario;
  }

  findAll() {
    return `This action returns all autenticacion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} autenticacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} autenticacion`;
  }
}
