import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { USERS } from '../entities/user.entity';

export const IsLoginUser = createParamDecorator(
  (data: keyof USERS | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user as USERS;

    if (!user) {
      return false;
    }
    if (data) {
      return user[data];
    }

    return user;
  },
);
