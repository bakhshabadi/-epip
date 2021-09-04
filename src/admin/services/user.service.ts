import { Inject, Injectable } from '@nestjs/common';
import { BaseService, IResponse } from 'epip/core';
import { Connection, Repository } from 'typeorm';
import { Users } from '../models/users.model';
// import * as epip from 'epip-libs/libs/epip-core/src';

@Injectable()
export class UserService extends BaseService<Users>{
  constructor(
    @Inject('USER_REPOSITORY')
    repo:Repository<Users>
  ){
      super(repo)
  }

  sum(){
    return {
      status:200,
      message:"SAD",
    } as IResponse<void>;
  }
}

export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Users),
    inject: ['DATABASE_CONNECTION'],
  },
];