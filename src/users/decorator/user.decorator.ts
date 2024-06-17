import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { USERS } from '../entities/user.entity';

export const User = createParamDecorator(
  (data: keyof USERS | undefined, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();

    const user = req.user as USERS;
    if (!user) {
      throw new InternalServerErrorException(
        'User 데코레이터는 AccessTokenGuard와 함께 사용해야합니다. ',
      );
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
