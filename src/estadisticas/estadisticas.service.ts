import { Injectable } from '@nestjs/common';
import { CreateEstadisticaDto } from './dto/create-estadistica.dto';
import { UpdateEstadisticaDto } from './dto/update-estadistica.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comentario, ComentarioDocument } from '../schemas/comentario.schema';
import { Model } from 'mongoose';
import { Publicacion, PublicacionDocument } from '../schemas/publicacion.schema';

@Injectable()
export class EstadisticasService {

  constructor(
    @InjectModel(Comentario.name)
    private comentarioModel: Model<ComentarioDocument>,

    @InjectModel(Publicacion.name)
    private publicacionModel: Model<PublicacionDocument>
  ) {}

  publicacionesPorUsuario(desde?: string, hasta?: string) {
    const match: any = {
      activo: true
    };


    if(desde || hasta) {

      match.createdAt = {};

      if(desde) {
        match.createdAt.$gte = new Date(desde);
      }

      if(hasta) {
        match.createdAt.$lte = new Date(hasta);
      }

    }


    return this.publicacionModel.aggregate([

      {
        $match: match
      },


      {
        $group: {
          _id: '$usuarioId',
          cantidad: {
            $sum: 1
          },
          usuario: {
            $first: '$usuario'
          }
        }
      },


      {
        $project: {
          _id: 0,
          username: '$usuario.username',
          nombre: '$usuario.nombre',
          cantidad: 1
        }
      },


      {
        $sort: {
          cantidad: -1
        }
      }

    ]);
  }
  comentarios(desde?: string, hasta?: string) {
    const match: any = {
      activo: true
    };


    if(desde || hasta) {

      match.createdAt = {};

      if(desde) {
        match.createdAt.$gte = new Date(desde);
      }

      if(hasta) {
        match.createdAt.$lte = new Date(hasta);
      }

    }


    return this.comentarioModel.aggregate([

      {
        $match: match
      },


      {
        $group: {

          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },

          cantidad: {
            $sum: 1
          }

        }
      },


      {
        $project: {

          _id: 0,
          fecha: '$_id',
          cantidad: 1

        }
      },


      {
        $sort: {
          fecha: 1
        }
      }

    ]);
  }
  comentariosPorPublicacion(desde?: string, hasta?: string) {

    const match: any = {
      activo: true
    };


    if(desde || hasta) {

      match.createdAt = {};

      if(desde) {
        match.createdAt.$gte = new Date(desde);
      }

      if(hasta) {
        match.createdAt.$lte = new Date(hasta);
      }

    }


    return this.comentarioModel.aggregate([


      {
        $match: match
      },


      {
        $addFields: {
          publicacionObjectId: {
            $toObjectId: "$publicacionId"
          }
        }
      },


      {
        $group: {

          _id: "$publicacionObjectId",

          cantidadComentarios: {
            $sum: 1
          }

        }

      },


      {
        $lookup: {

          from: "publicaciones",

          localField: "_id",

          foreignField: "_id",

          as: "publicacion"

        }

      },


      {
        $unwind: "$publicacion"
      },


      {
        $project: {

          _id: 0,

          publicacionId: "$_id",

          titulo: "$publicacion.titulo",

          cantidadComentarios: 1

        }

      },


      {
        $sort: {
          cantidadComentarios: -1
        }
      }


    ]);

  }
}
