"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionCreate = exports.Transaction = exports.TransactionSchema = void 0;
const mongoose = require("mongoose");
const shortid = require("shortid");
const class_validator_1 = require("class-validator");
const ServerConfig_1 = require("../configs/ServerConfig");
//Transaction Schema
exports.TransactionSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    type: { type: Number, required: true },
    userCode: { type: String, required: true },
    userName: { type: String, required: true },
    transactionName: { type: String, required: true },
    cashBefore: { type: Number, required: true },
    cashAfter: { type: Number, required: true },
    status: { type: String, default: ServerConfig_1.default.STATUS.SUCCESS },
    isActive: { type: Boolean, default: true },
    content: { type: String },
    note: { type: String }
}, {
    timestamps: true
});
exports.Transaction = mongoose.model('transactions', exports.TransactionSchema);
//START VALIDATOR
class TransactionCreate {
}
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0)
], TransactionCreate.prototype, "type", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 10)
], TransactionCreate.prototype, "userCode", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 20)
], TransactionCreate.prototype, "userName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 100)
], TransactionCreate.prototype, "transactionName", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0)
], TransactionCreate.prototype, "cashBefore", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0)
], TransactionCreate.prototype, "cashAfter", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 1000)
], TransactionCreate.prototype, "content", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 1000)
], TransactionCreate.prototype, "note", void 0);
exports.TransactionCreate = TransactionCreate;
;
//# sourceMappingURL=TransactionModel.js.map