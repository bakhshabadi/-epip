import { Inject, Injectable } from '@nestjs/common';
import { BaseService, IResponse} from '@epip/crud';
import { Connection, Repository } from 'typeorm';
import { User } from '../models/user.model';
// import * as epip from 'epip-libs/libs/epip-core/src';

@Injectable()
export class UserService extends BaseService<User>{
  constructor(
    @Inject('USER_REPOSITORY')
    repo:Repository<User>
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
    useFactory: (connection: Connection) => connection.getRepository(User),
    inject: ['DATABASE_CONNECTION'],
  },
];