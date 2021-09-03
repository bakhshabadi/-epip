"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseService = void 0;
const await_to_js_1 = require("await-to-js");
class BaseService {
    constructor(repo) {
        this.repo = repo;
    }
    async getAll() {
        const [err, results] = await (0, await_to_js_1.to)(this.repo.find({}));
        if (err) {
            return {
                status: 1,
                message: err.message,
            };
        }
        return {
            status: 200,
            message: "ok",
            results
        };
    }
}
exports.BaseService = BaseService;
//# sourceMappingURL=base.service.js.map