import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();

    const usuario = req.user;

    if(!usuario) {
      return false;
    }

    if(usuario.perfil !== 'administrador') {
      throw new ForbiddenException('No tiene permisos para realizar esta accion');
    }

    return true;
  }
}
