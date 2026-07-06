import { JwtService } from '@nestjs/jwt';
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
    private cloudinaryService: CloudinaryService,
    private jwtService: JwtService
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

    if(!usuario.activo) {
      throw new UnauthorizedException('Usuario inhabilitado');
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

    const access_token = await this.getJwt(usuario)

    return {usuario, token: access_token};

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
      password: passwordHash,
      activo: true
    }

    if(fotoPerfilUrl) {
      usuarioData.foto_perfil = fotoPerfilUrl;
    }

    const usuario = await this.usuarioModel.create(usuarioData);
    const access_token = await this.getJwt(usuario);
    return {usuario, token: access_token};
  }

  async getJwt(usuario: any) {
    const data = {
      username: usuario.username,
      email: usuario.email,
      perfil: usuario.perfil
    }
    return await this.jwtService.signAsync(data);
  }

  async authorize(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token);

      return {
        valid: true
      }
    } catch(error) {
      console.error(error);
      throw new UnauthorizedException('Token invalido o expirado');
    }
  }

  async refresh(token: string) {
    try {
      console.log('TOKEN:',token)
      const payload = await this.jwtService.verifyAsync(token);
      console.log('PAYLOAD:', payload)
      const usuario = await this.usuarioModel.findOne({username: payload.username})
      if(!usuario) {
        throw new UnauthorizedException('Usuario no encontrado');
      }
      const nuevoToken = await this.getJwt(usuario);

      return {usuario, token: nuevoToken}
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Token invalido o expirado');
    }
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
