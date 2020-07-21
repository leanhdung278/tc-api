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
exports.Database = void 0;
const mongoose = require("mongoose");
const ServerConfig_1 = require("../configs/ServerConfig");
const Locals_1 = require("./Locals");
const Log_1 = require("../middlewares/Log");
class Database {
    // Initialize your database pool
    static init() {
        const dsn = Locals_1.default.config().mongooseUrl;
        const options = { useNewUrlParser: true, useUnifiedTopology: true };
        mongoose.connect(dsn, options, (error) => {
            // handle the error case
            if (error) {
                Log_1.default.info('Failed to connect to the Mongo server!!');
                console.log(error);
                throw error;
            }
            else {
                Log_1.default.info('connected to mongo server');
            }
        });
    }
    static get(model, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (mongoose.modelNames().includes(model)) {
                let { limit, offset } = query;
                let schema = mongoose.model(model);
                //Set limit and offset
                let lm = Number(limit) || ServerConfig_1.default.LIMIT_DEFAULT;
                let os = Number(offset) || ServerConfig_1.default.OFFSET_DEFAULT;
                //Remove prototype limit and offset
                delete query['limit'];
                delete query['offset'];
                let keys = Object.keys(query);
                let sort = {};
                let filter = {
                    isActive: {
                        $eq: true
                    }
                };
                //Map filter query
                keys.map(key => {
                    if (typeof query[key] == 'object') {
                        if (query[key]['sort'] && query[key]['sort'] == 'desc')
                            sort[key] = -1;
                        if (query[key]['sort'] && query[key]['sort'] == 'asc')
                            sort[key] = 1;
                        if (query[key]['eq'])
                            filter[key] ? filter[key]['$eq'] = query[key]['eq'] : filter[key] = { $eq: query[key]['eq'] };
                        if (query[key]['gte'])
                            filter[key] ? filter[key]['$gte'] = query[key]['gte'] : filter[key] = { $gte: query[key]['gte'] };
                        if (query[key]['lte'])
                            filter[key] ? filter[key]['$lte'] = query[key]['lte'] : filter[key] = { $lte: query[key]['lte'] };
                        if (query[key]['contains'])
                            filter[key] ? filter[key]['$regex'] = query[key]['contains'] : filter[key] = { $regex: query[key]['contains'] };
                    }
                });
                //Find
                let count = yield schema.countDocuments(filter);
                let response = yield schema.find(filter).skip(os).limit(lm).sort(sort);
                return {
                    status: true,
                    data: response,
                    pagination: {
                        totalRows: count,
                        totalPages: Math.floor(count / lm)
                    }
                };
            }
            else {
                return {
                    status: false,
                    data: 'This table does not exist',
                    pagination: {
                        totalRows: 0,
                        totalPages: 0
                    }
                };
            }
        });
    }
}
exports.Database = Database;
exports.default = mongoose;
//# sourceMappingURL=Database.js.map