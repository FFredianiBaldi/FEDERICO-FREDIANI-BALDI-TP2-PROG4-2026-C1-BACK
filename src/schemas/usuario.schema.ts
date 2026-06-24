import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UsuarioDocument = HydratedDocument<Usuario>;

@Schema({
    timestamps: true,
    collection: 'usuarios'
})
export class Usuario {
    @Prop({
        required: true,
        trim: true
    })
    nombre!: string

    @Prop({
        required: true,
        trim: true
    })
    apellido!: string;

    @Prop({
        required: true,
        unique: true,
        lowercase: true
    })
    email!: string;

    @Prop({
        required: true,
        unique: true,
        trim: true
    })
    username!: string;

    @Prop({
        required: true,
    })
    password!: string;

    @Prop({
        required: true
    })
    fecha_nacimiento!: Date;

    @Prop({
        default: ''
    })
    biografia?: string;

    @Prop({
        default: 'usuario'
    })
    perfil?: string;

    @Prop({
        required: false,
        default: undefined
    })
    foto_perfil?: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);