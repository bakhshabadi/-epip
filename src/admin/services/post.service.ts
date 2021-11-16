import { Inject, Injectable } from '@nestjs/common';
import { BaseService } from '@lib/epip-crud';
import { Connection, Repository } from 'typeorm';
import { Post } from '../models/crm/post.model';
import { DB_Providers } from 'src/@database/enums/db.enum';

@Injectable()
export class PostService extends BaseService<Post>{
  constructor(
    @Inject('POST_REPOSITORY')
    repo:Repository<Post>
  ){
      super(repo)
  }
}

export const PostProviders = [
  {
    provide: 'POST_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Post),
    inject: [DB_Providers.CRM_CONNECTION],
  },
];