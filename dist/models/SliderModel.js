"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliderUpdate = exports.SliderCreate = exports.Slider = exports.SliderSchema = void 0;
const mongoose = require("mongoose");
const shortid = require("shortid");
const class_validator_1 = require("class-validator");
//Slider Schema
exports.SliderSchema = new mongoose.Schema({
    code: { type: String, default: shortid.generate },
    href: { type: String, default: '#' },
    imageUrl: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isShow: { type: Boolean, default: true },
    timeShow: { type: Number },
    timeHide: { type: Number },
    note: { type: String }
}, {
    timestamps: true
});
exports.Slider = mongoose.model('sliders', exports.SliderSchema);
//START VALIDATOR
class SliderCreate {
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 300)
], SliderCreate.prototype, "href", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.Length(1, 300)
], SliderCreate.prototype, "imageUrl", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    class_validator_1.Min(0)
], SliderCreate.prototype, "timeShow", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    class_validator_1.Min(0)
], SliderCreate.prototype, "timeHide", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 500)
], SliderCreate.prototype, "note", void 0);
exports.SliderCreate = SliderCreate;
;
class SliderUpdate {
}
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 300)
], SliderUpdate.prototype, "href", void 0);
__decorate([
    class_validator_1.IsString(),
    class_validator_1.IsOptional(),
    class_validator_1.Length(1, 300)
], SliderUpdate.prototype, "imageUrl", void 0);
__decorate([
    class_validator_1.IsBoolean()
], SliderUpdate.prototype, "isShow", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    class_validator_1.Min(0)
], SliderUpdate.prototype, "timeShow", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsNumber(),
    class_validator_1.Min(0)
], SliderUpdate.prototype, "timeHide", void 0);
__decorate([
    class_validator_1.IsOptional(),
    class_validator_1.IsString(),
    class_validator_1.Length(1, 500)
], SliderUpdate.prototype, "note", void 0);
exports.SliderUpdate = SliderUpdate;
;
//# sourceMappingURL=SliderModel.js.map