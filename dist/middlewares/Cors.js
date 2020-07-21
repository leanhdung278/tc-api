"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const Log_1 = require("./Log");
const Locals_1 = require("../providers/Locals");
class Cors {
    mount(_express) {
        Log_1.default.info('Booting the \'CORS\' middleware...');
        const options = {
            origin: Locals_1.default.config().url,
            optionsSuccessStatus: 200 // Some legacy browsers choke on 204
        };
        _express.use(cors(options));
        return _express;
    }
}
exports.default = new Cors;
//# sourceMappingURL=Cors.js.map