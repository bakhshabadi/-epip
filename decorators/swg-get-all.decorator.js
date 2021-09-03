"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiGetAll = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var IRes_interface_1 = require("../types/IRes.interface");
var ApiGetAll = function (model, path) {
    return (0, common_1.applyDecorators)((0, common_1.Get)(path || '/'), (0, swagger_1.ApiOkResponse)({
        schema: {
            allOf: [
                { $ref: (0, swagger_1.getSchemaPath)(IRes_interface_1.IResponse) },
                {
                    properties: {
                        results: {
                            type: 'array',
                            items: { $ref: (0, swagger_1.getSchemaPath)(model) },
                        },
                    },
                },
            ],
        },
    }));
};
exports.ApiGetAll = ApiGetAll;
//# sourceMappingURL=swg-get-all.decorator.js.map