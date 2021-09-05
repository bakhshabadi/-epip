import { ApiController, ApiDelete, ApiGet, ApiGetAll, ApiPatch, ApiPost, ApiPut, IResponse, IResponseAll } from "@epip/crud";
import { Body, Param } from "@nestjs/common";
import { DeepPartial } from "typeorm";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

@ApiController(User)
export class UserController {
  constructor(private readonly service: UserService) {
  }

  @ApiGetAll(User)
  public async getAll(): Promise<IResponseAll<User>>  {
    return await this.service.getAll();
  }

  @ApiGet(User,':id')
  public async get(@Param() param): Promise<IResponse<User>>  {
    return await this.service.get(param.id);
  }

  @ApiPost(User)
  public async post(@Body() entity:User): Promise<IResponse<User>>  {
    return await this.service.post(entity);
  }

  @ApiPut(User,':id')
  public async put(@Param() param,@Body() entity:User): Promise<IResponse<User>>  {
    return await this.service.put(param.id,entity);
  }

  @ApiPatch(User,':id')
  public async patch(@Param() param,@Body() entity:User): Promise<IResponse<User>>  {
    return await this.service.patch(param.id,entity);
  }

  @ApiDelete(User,':id')
  public async delete(@Param() param): Promise<IResponse<User>>  {
    return await this.service.delete(param.id);
  }
}
