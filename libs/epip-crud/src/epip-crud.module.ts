import { Module } from '@nestjs/common';
import * as decorators from './decorators';
import * as services from './services';
import * as types from './types';

@Module({
  providers: [services.BaseService],
  exports: [
    services.BaseService,
    
    decorators.ApiController,
    decorators.ApiDelete,
    decorators.ApiGetAll,
    decorators.ApiPatch,
    decorators.ApiPost,
    decorators.ApiGet,
    decorators.ApiPut,

    types.IResponseAll,
    types.BaseEntity,
    types.IResponse,
  ],
})
export class EpipCrudModule {}
