import { BadGatewayException } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions,
} from 'typeorm';

export class BaseService<T> {
  constructor(private genericRepository: Repository<T>) {}
  getAll() {
    try {
      return this.genericRepository.find();
    } catch (e) {
      throw new BadGatewayException(e.message);
    }
  }
  getOneByOptions(options: FindOneOptions<any> = {}) {
    try {
      return this.genericRepository.findOne(options);
    } catch (e) {
      throw new BadGatewayException(e.message);
    }
  }
  getManyByOptions(options: FindManyOptions<any> = {}) {
    try {
      return this.genericRepository.find(options);
    } catch (e) {
      throw new BadGatewayException(e.message);
    }
  }
  async create(entities: any, options: SaveOptions = {}) {
    try {
      const data = await this.genericRepository.save(entities, options);
      return data;
    } catch (e) {
      throw new BadGatewayException(e.message);
    }
  }
  async update(entities: any, options: SaveOptions) {
    try {
      const record = await this.getOneByOptions({
        where: {
          id: entities.id,
        },
      });
      if (!record) {
        throw new Error('Id is invalid');
      }
      const result = await this.genericRepository.save(
        {
          ...record,
          ...entities,
        },
        options,
      );
      return result;
    } catch (e) {
      throw new BadGatewayException(e.message);
    }
  }
  async deleteById(id: number) {
    try {
      return this.genericRepository.delete(id);
    } catch (e) {
      throw new BadGatewayException(e.message);
    }
  }
}
