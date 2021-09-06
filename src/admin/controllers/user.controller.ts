import { ApiController, ApiDelete, ApiGet, ApiGetAll, ApiPatch, ApiPost, ApiPut, IResponse, IResponseAll } from "@epip/crud";
import { Body, Param, Req } from "@nestjs/common";
import { Request } from "express";
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

@ApiController(User)
export class UserController {
  constructor(private readonly service: UserService) {
  }

  @ApiGetAll(User)
  public async getAll(@Req() req: Request): Promise<IResponseAll<User>>  {
    return await this.service.getAll();
  }

  @ApiGet(User,':id')
  public async get(@Req() req: Request, @Param() param): Promise<IResponse<User>>  {
    return await this.service.get(req, param.id);
  }

  @ApiPost(User)
  public async post(@Req() req: Request, @Body() entity:User): Promise<IResponse<User>>  {
    return await this.service.post(req, entity);
  }

  @ApiPut(User,':id')
  public async put(@Req() req: Request, @Param() param,@Body() entity:User): Promise<IResponse<User>>  {
    return await this.service.put(req, param.id,entity);
  }

  @ApiPatch(User,':id')
  public async patch(@Req() req: Request, @Param() param,@Body() entity:User): Promise<IResponse<User>>  {
    return await this.service.patch(req, param.id,entity);
  }

  @ApiDelete(User,':id')
  public async delete(@Req() req: Request, @Param() param): Promise<IResponse<User>>  {
    return await this.service.delete(req, param.id);
  }
}
