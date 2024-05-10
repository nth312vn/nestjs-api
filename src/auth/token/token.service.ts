import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/core/base/baseService';
import { Token } from 'src/entity/token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService extends BaseService<Token> {
  constructor(
    @InjectRepository(Token) private tokenRepository: Repository<Token>,
  ) {
    super(tokenRepository);
  }
}
