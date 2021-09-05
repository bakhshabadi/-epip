import { ApiController, ApiDelete, ApiGet, ApiGetAll, ApiPatch, ApiPost, ApiPut, IResponse, IResponseAll } from "@epip/crud";
import { DeepPartial } from "typeorm";
import { Users } from "../models/users.model";
import { UserService } from "../services/user.service";

@ApiController(Users)
export class UserController {
  constructor(private readonly service: UserService) {
  }

  @ApiGetAll(Users)
  public async getAll(): Promise<IResponseAll<Users>>  {
    return await this.service.getAll();
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
