import { PartialType } from '@nestjs/mapped-types';
import { CreatePublicacionDto } from './create-publicacion.dto';

export class UpdatePublicacioneDto extends PartialType(CreatePublicacionDto) {}
