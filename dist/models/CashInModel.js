"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AcceptCash = exports.NewCashClient = exports.CashConfigUpdate = exports.CashConfigCreate = exports.DenominationNested = exports.CashIn = exports.CashInConfig = exports.CashInSchema = exports.CashInConfigSchema = void 0;
const mongoose = require("mongoose");
const shortid = require("shortid");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const ServerConfig_1 = require("../configs/ServerConfig");
//Cash in config schema
exports.CashInConfigSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    type: { type: String, default: ServerConfig_1.default.FORM_CASH_IN.HANDMADE },
    carrierName: { type: String, required: true },
    denominations: [{
            _id: false,
            type: { type: Number, required: true },
            amount: { type: Number, required: true },
            percentReceived: { type: Number, required: true },
            unit: { type: String, default: ServerConfig_1.default.CASH_UNIT.VNĐ },
            amountReceived: { type: Number, required: true }
        }],
    isAllow: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true },
    note: { type: String }
}, {
    timestamps: true
});
//Cash in schema
exports.CashInSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    userCode: { type: String, required: true },
    username: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    type: { type: String, default: ServerConfig_1.default.FORM_CASH_IN.HANDMADE },
    carrierCode: { type: String, required: true },
    carrierName: { type: String, required: true },
    cashCode: { type: String, required: true },
    cashSerial: { type: String, required: true },
    cashAmount: { type: Number, required: true },
    cashReceived: { type: Number, required: true },
    status: { type: String, default: ServerConfig_1.default.STATUS.WAITING },
    note: { type: String }
}, {
    timestamps: true
});
exports.CashInConfig = mongoose.model('cashinconfigs', exports.CashInConfigSchema);
exports.CashIn = mongoose.model('cashins', exports.CashInSchema);
//START VALIDATOR
class DenominationNested {
}
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0)
], DenominationNested.prototype, "amount", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0)
], DenominationNested.prototype, "percentReceived", void 0);
exports.DenominationNested = DenominationNested;
class CashConfigCreate {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 30)
], CashConfigCreate.prototype, "carrierName", void 0);
__decorate([
    class_validator_1.IsArray(),
    class_validator_1.ValidateNested({ each: true }),
    class_transformer_1.Type(() => DenominationNested)
], CashConfigCreate.prototype, "denominations", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 500)
], CashConfigCreate.prototype, "note", void 0);
exports.CashConfigCreate = CashConfigCreate;
;
class CashConfigUpdate {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 30)
], CashConfigUpdate.prototype, "carrierName", void 0);
__decorate([
    class_validator_1.IsArray(),
    class_validator_1.ValidateNested({ each: true }),
    class_transformer_1.Type(() => DenominationNested)
], CashConfigUpdate.prototype, "denominations", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsBoolean()
], CashConfigUpdate.prototype, "isAllow", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 500)
], CashConfigUpdate.prototype, "note", void 0);
exports.CashConfigUpdate = CashConfigUpdate;
;
class NewCashClient {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 20)
], NewCashClient.prototype, "username", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 50)
], NewCashClient.prototype, "carrierName", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 50)
], NewCashClient.prototype, "cashCode", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 50)
], NewCashClient.prototype, "cashSerial", void 0);
__decorate([
    class_validator_1.IsNumber(),
    class_validator_1.Min(0)
], NewCashClient.prototype, "cashAmount", void 0);
exports.NewCashClient = NewCashClient;
;
class AcceptCash {
}
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(3, 20)
], AcceptCash.prototype, "cashinCode", void 0);
__decorate([
    class_validator_1.IsNumber()
], AcceptCash.prototype, "type", void 0);
exports.AcceptCash = AcceptCash;
//# sourceMappingURL=CashInModel.js.map