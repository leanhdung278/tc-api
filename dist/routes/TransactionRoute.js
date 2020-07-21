"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Api_1 = require("../providers/Api");
const Authorization_1 = require("../middlewares/Authorization");
const TransactionController_1 = require("../controllers/TransactionController");
class TransactionRouter {
    constructor() {
        this.router = express_1.Router();
        //CLIENT
        this.client = new class {
            read(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let query = req.query;
                        let { code } = req.user;
                        query['userCode'] = { eq: code };
                        let response = yield TransactionController_1.default.read(query);
                        response && response.status ? Api_1.API.ok(req, res, response.data, response.pagination) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
        };
        //ADMIN
        this.admin = new class {
            read(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let query = req.query;
                        let response = yield TransactionController_1.default.read(query);
                        response && response.status ? Api_1.API.ok(req, res, response.data, response.pagination) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
        };
        this.initializeRoutes();
    }
    initializeRoutes() {
        //CLIENT
        this.router
            .get('/', Authorization_1.default, this.client.read);
        //ADMIN
        this.router
            .get('/am', Authorization_1.default, this.admin.read);
    }
}
exports.default = TransactionRouter;
TransactionRouter.route = '/api/transaction';
;
//# sourceMappingURL=TransactionRoute.js.map