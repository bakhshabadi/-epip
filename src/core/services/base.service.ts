import { to } from 'await-to-js';
import { Repository } from 'typeorm';

import {IResponse} from '../types/IRes.interface';

export class BaseService<T> {
  constructor(private repo:Repository<T>){}
  public async getAll(): Promise<IResponse<T>> {
    const [err,results] = await to(this.repo.find({}));
    if(err){
      return {
        status: 1,
        message: err.message,
      } as IResponse<T>;
    }

    return {
      status:200,
      message:"ok",
      results
    }

  }
}
