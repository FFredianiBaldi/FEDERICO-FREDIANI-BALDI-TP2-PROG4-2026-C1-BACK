import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type ComentarioDocument = HydratedDocument<Comentario>

@Schema({
    timestamps: true,
    collection: 'comentarios'
})
export class Comentario {

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
        required: true
    })
    usuarioId!: string;

    @Prop({
        required: true
    })
    activo!: boolean;

    @Prop({
        required: true
    })
    editado!: boolean;

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

    @Prop({
        required: true
    })
    publicacionId!: string;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);