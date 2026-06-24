import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacioneDto } from './dto/update-publicacione.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion, PublicacionDocument } from 'src/schemas/publicacion.schema';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Usuario, UsuarioDocument } from 'src/schemas/usuario.schema';

@Injectable()
export class PublicacionesService {

  constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<PublicacionDocument>,

    @InjectModel(Usuario.name)
    private usuarioModel: Model<UsuarioDocument>,

    private cloudinaryService: CloudinaryService
  ) {}

  async create(createPublicacionDto: CreatePublicacionDto, imagen?: Express.Multer.File) {
    if(!createPublicacionDto.contenido && !imagen) {
      throw new BadRequestException('Se requiere contenido o una imagen')
    }

    let imagenUrl: string | null = null;

    if(imagen) {
      const resultadoCloudinary: any = await this.cloudinaryService.uploadImage(imagen);

      imagenUrl = resultadoCloudinary.secure_url;
    }

    const usuario = await this.usuarioModel.findById(
      createPublicacionDto.usuarioId
    )

    if(!usuario) {
      throw new NotFoundException('Usuario no encontrado')
    }

    const publicacionData: any = {
      ...createPublicacionDto,
      usuario: {
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        username: usuario.username,
        foto_perfil: usuario.foto_perfil
      },
      activo: true
    }

    if(imagenUrl) {
      publicacionData.imagen = imagenUrl;
    }

    const publicacion = await this.publicacionModel.create(publicacionData);

    return publicacion;
  }

  async findAll(offset:number, limit: number, sortBy?: string, order:'asc' | 'desc' = 'desc') {
    const direction = order === 'asc' ? 1 : -1;

    if(sortBy === 'likes'){
      return await this.publicacionModel.aggregate([
        {
          $match: {
            activo: true
          }
        },
        {
          $addFields: {
            likesCount: {
              $size: '$likes'
            }
          }
        },
        {
          $sort: {
            likesCount: direction
          }
        },
        {
          $skip: offset
        },
        {
          $limit: limit
        }
      ]);
    }

    return await this.publicacionModel
      .find({activo: true})
      .sort({
        createdAt: direction
      })
      .skip(offset)
      .limit(limit)
  }

  findOne(id: number) {
    return `This action returns a #${id} publicacione`;
  }

  update(id: number, updatePublicacioneDto: UpdatePublicacioneDto) {
    return `This action updates a #${id} publicacione`;
  }

  async remove(id: string, usuarioId: string) {
    const publicacion = await this.publicacionModel.findById(id);

    if(!publicacion) {
      throw new NotFoundException('No se encontro la publicacion')
    }

    const usuario = await this.usuarioModel.findById(usuarioId);

    if(!usuario) {
      throw new UnauthorizedException('Usuario no existente')
    }

    const esOwner = publicacion.usuarioId === usuarioId;
    const esAdmin = usuario.perfil === 'administrador';

    if(!esOwner && !esAdmin) {
      throw new UnauthorizedException('Este usuario no tiene permiso de eliminar esta publicacion')
    }

    return await this.publicacionModel.findByIdAndUpdate(
      id,
      {activo: false},
      {returnDocument: 'after'}
    )
  }

  async like(usuarioId:string, id:string) {
    const publicacion = await this.publicacionModel.findById(id);

    if(!publicacion){
      throw new NotFoundException('No se encontro la publicacion')
    }

    if(publicacion.likes.includes(usuarioId)) {
      throw new BadRequestException('El usuario ya le dio like a esta publicacion');
    }

    publicacion.likes.push(usuarioId);

    await publicacion.save();

    console.log(publicacion.likes);
  }

  async dislike(usuarioId:string, id: string) {
    const publicacion = await this.publicacionModel.findById(id);

    if(!publicacion){
      throw new NotFoundException('No se encontro la publicacion')
    }

    if(!publicacion.likes.includes(usuarioId)) {
      throw new BadRequestException('El usuario no le dio like a esta publicacion');
    }

    return await this.publicacionModel.findByIdAndUpdate(id, 
      {
        $pull: {
          likes: usuarioId
        }
      },
      {
        returnDocument: 'after'
      }
    )
  }
}
