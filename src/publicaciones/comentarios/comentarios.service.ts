import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario, ComentarioDocument } from '../../schemas/comentario.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from '../../cloudinary/cloudinary.service';
import { Usuario, UsuarioDocument } from '../../schemas/usuario.schema';

@Injectable()
export class ComentariosService {

  constructor(
    @InjectModel(Comentario.name)
    private comentarioModel: Model<ComentarioDocument>,

    @InjectModel(Usuario.name)
    private usuarioModel: Model<UsuarioDocument>,

    private cloudinaryService: CloudinaryService
  ) {}

  async create(createComentarioDto: CreateComentarioDto, imagen?: Express.Multer.File) {
    if(!createComentarioDto.contenido && !imagen) {
      throw new BadRequestException('Se requiere contenido o una imagen')
    }

    let imagenUrl: string | null = null;

    if(imagen) {
      const resultadoCloudinary: any = await this.cloudinaryService.uploadImage(imagen);

      imagenUrl = resultadoCloudinary.secure_url;
    }

    const usuario = await this.usuarioModel.findById(createComentarioDto.usuarioId);

    if(!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const comentarioData: any = {
      ...createComentarioDto,
      usuario: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        username: usuario.username,
        foto_perfil: usuario.foto_perfil
      },
      activo: true,
      editado: false
    }

    if(imagenUrl) {
      comentarioData.imagen = imagenUrl;
    }

    const comentario = await this.comentarioModel.create(comentarioData);

    return comentario;
  }

  findAll() {
    return `This action returns all comentarios`;
  }

  async findPostComments(publicacionId: string, offset = 0, limit = 10, order: 'asc' | 'desc' = 'desc') {
    const comentarios = await this.comentarioModel
      .find({
        publicacionId,
        activo:true
      })
      .sort({
        createdAt: order === 'asc' ? 1 : -1
      })
      .skip(offset)
      .limit(limit);

    const total = await this.comentarioModel.countDocuments({
      publicacionId,
      activo: true
    });

    return {total, offset, limit, comentarios};
  }

  async update(
    comentarioId: string,
    usuarioId: string,
    updateComentarioDto: Partial<CreateComentarioDto>,
    imagen?: Express.Multer.File
  ) {
    const comentario = await this.comentarioModel.findById(comentarioId);

    if(!comentario) {
      throw new NotFoundException('Comentario no encontrado');
    }

    if(comentario.usuarioId !== usuarioId) {
      throw new ForbiddenException('No tienes permisos para modificar este comentario');
    }

    let imagenUrl: string | null = null;

    if(imagen) {
      const resultadoCloudinary: any = await this.cloudinaryService.uploadImage(imagen);

      imagenUrl = resultadoCloudinary.secure_url;
    }

    const datosActualizados: any = {
      ...updateComentarioDto,
      editado: true
    };

    if (imagenUrl) {
      datosActualizados.imagen = imagenUrl;
    }

    if(!updateComentarioDto.contenido?.trim() && !imagen && !comentario.imagen) {
      throw new BadRequestException('Se requiere contenido o una imagen');
    }

    const comentarioActualizado = await this.comentarioModel.findByIdAndUpdate(
      comentarioId,
      datosActualizados,
      {
        new: true,
        runValidators: true
      }
    )

    return comentarioActualizado;
  }

  async remove(comentarioId: string, usuarioId: string) {
    const comentario = await this.comentarioModel.findById(comentarioId);

    if(!comentario){
      throw new NotFoundException('Comentario no encontrado');
    }

    if(comentario.usuarioId.toString() !== usuarioId) {
      throw new ForbiddenException('No tiene permiso para eliminar este comentario');
    }

    const comentarioActualizado = await this.comentarioModel.findByIdAndUpdate(
      comentarioId,
      {
        activo: false
      },
      {
        new:true
      }
    )

    return comentarioActualizado;
  }
}
