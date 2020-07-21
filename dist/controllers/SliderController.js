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
const Database_1 = require("../providers/Database");
const PermissionConfig_1 = require("../configs/PermissionConfig");
const SliderModel_1 = require("../models/SliderModel");
const SliderRoute_1 = require("../routes/SliderRoute");
class SliderController {
}
exports.default = SliderController;
//Get permission group
SliderController.getPermission = (name) => PermissionConfig_1.PERMISSION.find(item => item.path == SliderRoute_1.default.route && item.name == name);
SliderController.read = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let doc = yield Database_1.Database.get('sliders', query);
    return doc;
});
//CLIENT
SliderController.client = new class {
};
//ADMIN
SliderController.admin = new class {
    constructor() {
        this.create = (data) => __awaiter(this, void 0, void 0, function* () {
            //New slider
            let slider = new SliderModel_1.Slider();
            //Map and update data
            let keys = Object.keys(data);
            keys.map(key => data[key] ? slider[key] = data[key] : slider[key] = undefined);
            //Save
            let doc = yield slider.save();
            return { status: true, data: doc };
        });
        this.delete = (code) => __awaiter(this, void 0, void 0, function* () {
            let response = { status: false, data: 'An error occurred' };
            let update = yield SliderModel_1.Slider.updateOne({ code: code }, {
                $set: {
                    isActive: false
                }
            }, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
        this.update = (code, data) => __awaiter(this, void 0, void 0, function* () {
            let response = { status: false, data: 'An error occurred' };
            let update = yield SliderModel_1.Slider.updateOne({ code: code }, data, { new: true, omitUndefined: true });
            if (update.n == 1 || update.nModified == 1)
                response = { status: true, data: undefined };
            return response;
        });
    }
};
//# sourceMappingURL=SliderController.js.map