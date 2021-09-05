// import { IResponse } from "src/@core/types/IRes.interface";
// import { ApiGetAll } from "src/@core/decorators/swg-get-all.decorator";
// import { BaseController } from "src/@core/controllers/base.controller";
// import { ApiController } from "src/@core/decorators/swg-ctrl.decorator";

import { ApiController, ApiDelete, ApiGet, ApiGetAll, ApiPatch, ApiPost, ApiPut, IResponse, IResponseAll } from "@epip/crud";
import { DeepPartial } from "typeorm";
import { Users } from "../models/users.model";
import { UserService } from "../services/user.service";

@ApiController(Users)
export class UserController {
  constructor(private readonly service: UserService) {
  }

  @ApiGet(Users)
  public async get(id:number): Promise<IResponse<Users>>  {
    return await this.service.get(id);
  }

  @ApiPost(Users)
  public async post(entity:Users): Promise<IResponse<Users>>  {
    return await this.service.post(entity);
  }

  @ApiPut(Users)
  public async put(id:number,entity:Users): Promise<IResponse<Users>>  {
    return await this.service.put(id,entity);
  }

  @ApiPatch(Users)
  public async patch(id:number,entity:DeepPartial<Users>): Promise<IResponse<DeepPartial<Users>>>  {
    return await this.service.patch(id,entity);
  }

  @ApiDelete(Users)
  public async delete(id:number): Promise<IResponse<Users>>  {
    return await this.service.delete(id);
  }
}
