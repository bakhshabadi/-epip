import { ApiController, ApiDelete, ApiGet, ApiGetAll, ApiPatch, ApiPost, ApiPut, IResponse, IResponseAll } from "@lib/epip-crud";
import { Body, Param, Req } from "@nestjs/common";
import { Request } from "express";
import { Post } from "src/admin/models/crm/post.model";
import { PostService } from "src/admin/services/post.service";

@ApiController(Post)
export class PostController {
  constructor(private readonly service: PostService) {
  }

  @ApiGetAll(Post)
  public async getAll(@Req() req: Request): Promise<IResponseAll<Post>>  {
    return await this.service.getAll(req);
  }

  @ApiGet(Post,':id')
  public async get(@Req() req: Request, @Param() param): Promise<IResponse<Post>>  {
    return await this.service.get(req,param.id);
  }

  @ApiPost(Post)
  public async post(@Req() req: Request, @Body() entity:Post): Promise<IResponse<Post>>  {
    return await this.service.post(req,entity);
  }

  @ApiPut(Post,':id')
  public async put(@Req() req: Request, @Param() param,@Body() entity:Post): Promise<IResponse<Post>>  {
    return await this.service.put(req,param.id,entity);
  }

  @ApiPatch(Post,':id')
  public async patch(@Req() req: Request, @Param() param,@Body() entity:Post): Promise<IResponse<Post>>  {
    return await this.service.patch(req,param.id,entity);
  }

  @ApiDelete(Post,':id')
  public async delete(@Req() req: Request, @Param() param): Promise<IResponse<Post>>  {
    return await this.service.delete(req,param.id);
  }
}
