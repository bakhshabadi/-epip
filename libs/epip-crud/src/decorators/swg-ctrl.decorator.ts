import { applyDecorators, Controller, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, ApiTags, getSchemaPath } from "@nestjs/swagger";

export const ApiController = <TModel extends Type<any>>(
    model: TModel,
  ) => {
    return applyDecorators(
      ApiTags(model.name),
      Controller(model.name),
      ApiExtraModels(model)
    );
  };