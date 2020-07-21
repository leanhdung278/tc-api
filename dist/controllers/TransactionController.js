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
const TransactionModel_1 = require("./../models/TransactionModel");
const Database_1 = require("../providers/Database");
const UserController_1 = require("./UserController");
class TransactionController {
}
exports.default = TransactionController;
TransactionController.read = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let doc = yield Database_1.Database.get('transactions', query);
    return doc;
});
TransactionController.create = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let { userCode } = data;
    let user = yield UserController_1.default.findOneUser({ code: userCode });
    if (!user) {
        return {
            status: false,
            data: 'An error occurred'
        };
    }
    ;
    let transaction = new TransactionModel_1.Transaction(data);
    let doc = yield transaction.save();
    return { status: true, data: doc };
});
//CLIENT
TransactionController.client = new class {
};
//ADMIN
TransactionController.admin = new class {
};
//# sourceMappingURL=TransactionController.js.map