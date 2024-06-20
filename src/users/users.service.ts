import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { USERS } from './entities/user.entity';
import { Repository } from 'typeorm';
import { classToPlain } from 'class-transformer';
import { AwsService } from '../aws/aws.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(USERS)
    private readonly usersRepository: Repository<USERS>,
    private readonly awsService: AwsService,
  ) {}

  async getAllUser() {
    return await this.usersRepository.find();
  }

  async createUser(
    user: Pick<USERS, 'nickname' | 'email' | 'password' | 'phoneNumber'>,
    hash: string,
    file: Express.Multer.File,
  ) {
    const nicknameExists = await this.usersRepository.exists({
      where: {
        nickname: user.nickname,
      },
    });
    if (nicknameExists) {
      throw new BadRequestException('EXIST_NICKNAME');
    }
    const emailExists = await this.usersRepository.exists({
      where: {
        email: user.email,
      },
    });
    if (emailExists) {
      throw new BadRequestException('EXIST_EMAIL');
    }
    const phoneExists = await this.usersRepository.exists({
      where: {
        phoneNumber: user.phoneNumber
      }
    })
    if (phoneExists) {
      throw new BadRequestException('EXIST_PHONE');
    }
    const profileImageUpload = await this.awsService.saveImage(file, 'profile');

    const userObject = this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: hash,
      phoneNumber: user.phoneNumber,
      profileImage: profileImageUpload,
    });

    const newUser = await this.usersRepository.save(userObject);
    console.log("newUser", newUser);
    const userWithoutPassword = classToPlain(newUser);
    return {
      success: true,
      data: userWithoutPassword,
    };
  }

  async getUserByEmail(email: string) {
    return this.usersRepository.findOne({
      where: {
        email,
      },
    });
  }
}
