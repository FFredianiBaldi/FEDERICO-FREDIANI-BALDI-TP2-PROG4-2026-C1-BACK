import { IsString, MinLength, Matches } from "class-validator";

export class LoginAutenticacionDto {
    @IsString()
    identificador!: string;

    @MinLength(8)
    @Matches(/^(?=.*[A-Z])(?=.*\d).+$/)
    password!: string;



}
