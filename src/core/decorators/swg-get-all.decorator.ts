import { applyDecorators, Get, Type } from "@nestjs/common";
import { ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { IResponse } from "../types/IRes.interface";

export const ApiGetAll = <TModel extends Type<any>>(
    model: TModel, path?: string
  ) => {
    return applyDecorators(
      Get(path || '/'),
      ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(IResponse) },
            {
              properties: {
                results: {
                  type: 'array',
                  items: { $ref: getSchemaPath(model) },
                },
              },
            },
          ],
        },
      }),
    );
  };