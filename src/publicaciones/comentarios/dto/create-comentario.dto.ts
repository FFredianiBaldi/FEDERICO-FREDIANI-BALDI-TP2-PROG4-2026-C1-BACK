import {IsString} from "class-validator";


export class CreateComentarioDto {

    @IsString()
    contenido?: string = '';

    @IsString()
    usuarioId!: string;

    @IsString()
    publicacionId!: string;
}
