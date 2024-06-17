import { ExecutionContext, Injectable } from '@nestjs/common';
import { isLoginBearerTokenGuard } from './isLogin-bearer-token.guard';

@Injectable()
export class IsLoginAccessTokenGuard extends isLoginBearerTokenGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    await super.canActivate(context);

    const req = context.switchToHttp().getRequest();

    return true;
  }
}
