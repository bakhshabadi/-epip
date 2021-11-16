import { applyDecorators, Delete, Get, Patch, Post, Put, Type } from "@nestjs/common";
import { ApiOkResponse, ApiParam, getSchemaPath } from "@nestjs/swagger";
import { IResponseAll } from "../types/res.interface";

export const ApiGetAll = <TModel extends Type<any>>(
  model: TModel,
  path?: string
) => {
  let s=getSchemaPath(IResponseAll);
  console.log(s);
  return applyDecorators(
    Get(path || "/"),
    ApiOkResponse({
      schema: {
        allOf: [
          {
            properties: {
              results: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
          { $ref: getSchemaPath(IResponseAll)},
        ],
      },
    })
  );
};

export const ApiGet = <TModel extends Type<any>>(
  model: TModel,
  path?: string
) => {
  return applyDecorators(
    Get(path || "/:id"),
    ApiParam({
      name: 'id',
      type: 'string'
    }),
    ApiOkResponse({
      type: model,
    })
  );
};

export const ApiPost = <TModel extends Type<any>>(
  model: TModel,
  path?: string
) => {
  return applyDecorators(
    Post(path || "/"),
    ApiOkResponse({
      type: model,
    })
  );
};

export const ApiPut = <TModel extends Type<any>>(
  model: TModel,
  path?: string
) => {
  return applyDecorators(
    Put(path || "/:id"),
    ApiParam({
      name: 'id',
      type: 'string'
    }),
    ApiOkResponse({
      type: model,
    })
  );
};

export const ApiPatch = <TModel extends Type<any>>(
  model: TModel,
  path?: string
) => {
  return applyDecorators(
    Patch(path || "/:id"),
    ApiParam({
      name: 'id',
      type: 'string'
    }),
    ApiOkResponse({
      type: model,
    })
  );
};

export const ApiDelete = <TModel extends Type<any>>(
  model: TModel,
  path?: string
) => {
  return applyDecorators(
    Delete(path || "/:id"),
    ApiParam({
      name: 'id',
      type: 'string'
    }),
    ApiOkResponse({
      type: model,
    })
  );
};
