"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cors_1 = require("./Cors");
const Http_1 = require("./Http");
const StatusMonitor_1 = require("./StatusMonitor");
const Locals_1 = require("../providers/Locals");
class Kernel {
    static init(_express) {
        // Check if CORS is enabled
        if (Locals_1.default.config().isCORSEnabled) {
            // Mount CORS middleware
            _express = Cors_1.default.mount(_express);
        }
        // Mount basic express apis middleware
        _express = Http_1.default.mount(_express);
        // Mount status monitor middleware
        _express = StatusMonitor_1.default.mount(_express);
        return _express;
    }
}
exports.default = Kernel;
//# sourceMappingURL=Kernel.js.map