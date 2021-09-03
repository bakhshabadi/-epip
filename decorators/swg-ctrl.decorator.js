"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var ApiController = function (model) {
    return (0, common_1.applyDecorators)((0, swagger_1.ApiTags)(model.name), (0, common_1.Controller)(model.name), (0, swagger_1.ApiExtraModels)(model));
};
exports.ApiController = ApiController;
//# sourceMappingURL=swg-ctrl.decorator.js.map