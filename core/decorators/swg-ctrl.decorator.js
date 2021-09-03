"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const ApiController = (model) => {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(model.name), (0, common_1.Controller)(model.name), (0, swagger_1.ApiExtraModels)(model));
};
exports.ApiController = ApiController;
//# sourceMappingURL=swg-ctrl.decorator.js.map