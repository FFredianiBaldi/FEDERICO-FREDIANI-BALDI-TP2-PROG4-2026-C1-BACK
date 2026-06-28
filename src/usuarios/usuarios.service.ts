import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Usuario, UsuarioDocument } from '../schemas/usuario.schema';
import { Model } from 'mongoose';
import { RegistroAutenticacionDto } from '../autenticacion/dto/registro-autenticacion.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { PublicacionDocument } from 'src/schemas/publicacion.schema';

@Injectable()
export class UsuariosService {

  constructor(
    @InjectModel(Usuario.name)
    private usuarioModel: Model<UsuarioDocument>,
    private publicacionModel: Model<PublicacionDocument>,
    private cloudinaryService: CloudinaryService
  ) {}

  create(createUsuarioDto: CreateUsuarioDto) {
    return 'This action adds a new usuario';
  }

  findAll() {
    return `This action returns all usuarios`;
  }

  async findOne(id: string) {
    return await this.usuarioModel.findById(id)
  }

  async findByUsername(username:string) {
    return await this.usuarioModel.findOne({username});
  }

  async update(id: string, dto: Partial<RegistroAutenticacionDto>, fotoPerfil?: Express.Multer.File) {
    const usuarioActual = await this.usuarioModel.findById(id);

    if(!usuarioActual) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const orConditions: any[] = [];

    if(dto.email) {
      orConditions.push({email: dto.email});
    }

    if(dto.username) {
      orConditions.push({username: dto.username})
    }

    if(orConditions.length > 0) {
      const usuarioExistente = await this.usuarioModel.findOne({
        $or: orConditions,
        _id: {$ne: id}
      });

      if(usuarioExistente) {
        throw new BadRequestException('Email o username ya en uso')
      }
    }

    let fotoPerfilUrl: string | null = null;

    if(fotoPerfil) {
      const resultadoCloudinary: any = await this.cloudinaryService.uploadImage(fotoPerfil);

      fotoPerfilUrl = resultadoCloudinary.secure_url;
    }

    const updateData: any = {
      ...dto
    };

    if(fotoPerfilUrl) {
      updateData.foto_perfil = fotoPerfilUrl;
    }

    const usuarioActualizado = await this.usuarioModel.findByIdAndUpdate(
      id,
      updateData,
      {new: true}
    );

    await this.publicacionModel.updateMany(
      {usuarioId: id},
      {
        $set: {
          "usuario.nombre": usuarioActualizado?.nombre,
          "usuario.apellido": usuarioActualizado?.apellido,
          "usuario.username": usuarioActualizado?.username,
          "usuario.foto_perfil": usuarioActualizado?.foto_perfil,
        }
      }
    )
    
    return usuarioActualizado;

  }

  remove(id: number) {
    return `This action removes a #${id} usuario`;
  }
}
