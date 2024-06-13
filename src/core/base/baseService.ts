import { BadGatewayException, NotFoundException } from '@nestjs/common';
import {
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions,
} from 'typeorm';

export class BaseService<T extends { id: string }> {
  private handleException(message: string) {
    throw new BadGatewayException(message);
  }
  constructor(private genericRepository: Repository<T>) {}
  async getAll(): Promise<T[]> {
    try {
      return await this.genericRepository.find();
    } catch (e) {
      this.handleException(e.message);
    }
  }
  async getOneByOptions(options: FindOneOptions<any> = {}) {
    try {
      return await this.genericRepository.findOne(options);
    } catch (e) {
      this.handleException(e.message);
    }
  }
  async getManyByOptions(options: FindManyOptions<any> = {}) {
    try {
      return await this.genericRepository.find(options);
    } catch (e) {
      this.handleException(e.message);
    }
  }
  async create(entities: any, options: SaveOptions = {}) {
    try {
      const data = await this.genericRepository.save(entities, options);
      return data;
    } catch (e) {
      this.handleException(e.message);
    }
  }
  async update(entities: Partial<T>, options: SaveOptions = {}) {
    try {
      const record = await this.getOneByOptions({
        where: {
          id: entities.id,
        },
      });
      if (!record) {
        throw new NotFoundException('Id is invalid');
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
      this.handleException(e.message);
    }
  }
  async deleteById(id: string) {
    try {
      const result = await this.genericRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Entity with id ${id} not found`);
      }
      return result;
    } catch (e) {
      this.handleException(e.message);
    }
  }
}
