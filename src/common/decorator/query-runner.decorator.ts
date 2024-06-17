import {createParamDecorator, InternalServerErrorException} from "@nestjs/common";

export const QueryRunner = createParamDecorator((data, context) => {
    const req = context.switchToHttp().getRequest();

    if (!req.queryRunner) {
      throw new InternalServerErrorException(
        'QueryRunner Decorator를 사용하려면 TransactionInterceptor를 적용해야 합니다.');
    }
    return req.queryRunner;
  }
);
