import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from '@nestjs/common';
import {Observable} from 'rxjs';

@Injectable()
export class AuthWebsocketGuard implements CanActivate {
  constructor(private readonly verifyOptions?: any) {
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const client = context.switchToWs().getClient();
    const token = (client.handshake?.headers.cookie).split("sAccessToken=")[1].split(";")[0]

    if (!token) {
      throw new UnauthorizedException('Anuthorized');
    }

    return true
  }
}