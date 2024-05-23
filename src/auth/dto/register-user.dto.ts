import { PickType } from '@nestjs/mapped-types';
import { USERS } from '../../users/entities/user.entity';

export class RegisterUserDto extends PickType(USERS, [
  'nickname',
  'email',
  'password',
]) {}
