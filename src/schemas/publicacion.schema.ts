import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PublicacionDocument = HydratedDocument<Publicacion>

@Schema({
    timestamps: true,
    collection: 'publicaciones'
})
export class Publicacion {

    @Prop({
        trim: true,
        required: true
    })
    titulo!: string;

    @Prop({
        trim: true,
        default: ''
    })
    contenido?: string;

    @Prop({
        trim: true,
    })
    imagen?: string;

    @Prop({
        type:[String],
        default: [],
    })
    likes!: string[];

    @Prop({
        required: true
    })
    usuarioId!: string;

    @Prop({
        required: true
    })
    activo!: boolean;

    @Prop({
        type: {
            nombre: String,
            apellido: String,
            username: String,
            foto_perfil: String
        },
        required: true
    })
    usuario!: {
        nombre: string;
        apellido: string;
        username: string;
        foto_perfil: string;
    }
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);