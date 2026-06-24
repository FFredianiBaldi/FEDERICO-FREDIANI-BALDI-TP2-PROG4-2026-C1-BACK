import { IsDateString, IsString, IsNumber, Min, IsBoolean } from "class-validator";


export class CreatePublicacionDto {
    @IsString()
    titulo!: string;

    @IsString()
    contenido?: string = '';

    likes:any[] = [];

    @IsString()
    usuarioId!: string;

    @IsBoolean()
    activo!: boolean;
}
