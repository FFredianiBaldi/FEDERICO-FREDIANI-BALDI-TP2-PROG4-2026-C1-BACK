import { IsString, IsEmail, MinLength, IsDateString, Matches } from "class-validator";

export class RegistroAutenticacionDto {
    @IsString()
    nombre!: string;

    @IsString()
    apellido!: string;

    @IsEmail()
    email!: string;

    @IsString()
    username!: string;

    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/)
    password!: string;

    @IsDateString()
    fecha_nacimiento!: string;

    @IsString()
    biografia?: string;

    @IsString()
    perfil: string = 'usuario';  
}
