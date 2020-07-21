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
const SliderModel_1 = require("../models/SliderModel");
const Api_1 = require("../providers/Api");
const Validation_1 = require("../middlewares/Validation");
const Authorization_1 = require("../middlewares/Authorization");
const SliderController_1 = require("../controllers/SliderController");
const Permission_1 = require("../middlewares/Permission");
const Utils_1 = require("../providers/Utils");
class SliderRouter {
    constructor() {
        this.router = express_1.Router();
        //CLIENT
        this.client = new class {
        };
        //ADMIN
        this.admin = new class {
            create(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let data = req.body;
                        let response = yield SliderController_1.default.admin.create(data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            delete(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let { code } = req.params;
                        let response = yield SliderController_1.default.admin.delete(code);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
                    }
                    catch (error) {
                        Api_1.API.serverError(req, res, error);
                    }
                });
            }
            update(req, res, next) {
                return __awaiter(this, void 0, void 0, function* () {
                    try {
                        let { code } = req.params;
                        let data = req.body;
                        let response = yield SliderController_1.default.admin.update(code, data);
                        response && response.status ? Api_1.API.ok(req, res, response.data) : Api_1.API.badRequest(req, res, response.data);
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
        //Permission group
        let permissionGroup = Utils_1.default.getPermission('full_slider', SliderRouter.route);
        //CLIENT
        this.router
            .get('/', Authorization_1.default, this.read);
        //ADMIN
        this.router
            .get('/am', Authorization_1.default, this.read)
            .post('/am/new', Authorization_1.default, Permission_1.default(permissionGroup), Validation_1.default(SliderModel_1.SliderCreate), this.admin.create)
            .put('/am/:code', Authorization_1.default, Permission_1.default(permissionGroup), Validation_1.default(SliderModel_1.SliderUpdate), this.admin.update)
            .delete('/am/:code', Authorization_1.default, Permission_1.default(permissionGroup), this.admin.delete);
    }
    read(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let query = req.query;
                let response = yield SliderController_1.default.read(query);
                response && response.status ? Api_1.API.ok(req, res, response.data, response.pagination) : Api_1.API.badRequest(req, res, response.data);
            }
            catch (error) {
                Api_1.API.serverError(req, res, error);
            }
        });
    }
}
exports.default = SliderRouter;
SliderRouter.route = '/api/slider';
;
//# sourceMappingURL=SliderRoute.js.map