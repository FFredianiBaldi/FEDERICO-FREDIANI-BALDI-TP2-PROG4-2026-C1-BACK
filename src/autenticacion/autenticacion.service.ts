import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginAutenticacionDto } from './dto/login-autenticacion.dto';
import { RegistroAutenticacionDto } from './dto/registro-autenticacion.dto';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from '../schemas/usuario.schema';

import * as bcrypt from 'bcrypt';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class AutenticacionService {

  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<UsuarioDocument>,
    private cloudinaryService: CloudinaryService
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

  async registro(registroAutenticacionDto: RegistroAutenticacionDto, fotoPerfil?: Express.Multer.File) {
    const usuarioExistente = await this.usuarioModel.findOne({
      $or: [
        {email: registroAutenticacionDto.email},
        {username: registroAutenticacionDto.username}
      ]
    });

    if(usuarioExistente) {
      throw new BadRequestException('El usuario ya existe');
    }

    const passwordHash = await bcrypt.hash(registroAutenticacionDto.password, 10)

    let fotoPerfilUrl: string | null = null;

    if(fotoPerfil) {
      const resultadoCloudinary: any = await this.cloudinaryService.uploadImage(fotoPerfil);

      fotoPerfilUrl = resultadoCloudinary.secure_url;
    }

    
    const usuarioData: any = {
      ...registroAutenticacionDto,
      password: passwordHash
    }

    if(fotoPerfilUrl) {
      usuarioData.foto_perfil = fotoPerfilUrl;
    }

    const usuario = await this.usuarioModel.create(usuarioData);

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
