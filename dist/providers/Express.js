"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const Locals_1 = require("./Locals");
const routes_1 = require("../routes/routes");
const Kernel_1 = require("../middlewares/Kernel");
const shortid = require("shortid");
class Express {
    /**
     * Initializes the express server
     */
    constructor() {
        this.express = express();
        this.mountDotEnv();
        this.mountMiddlewares();
        this.mountRoutes();
        this.mountServices();
    }
    mountDotEnv() {
        this.express = Locals_1.default.init(this.express);
    }
    /**
     * Mounts all the defined middlewares
     */
    mountMiddlewares() {
        this.express = Kernel_1.default.init(this.express);
    }
    /**
     * Mounts all the defined routes
     */
    mountRoutes() {
        routes_1.Routes.mountWeb(this.express);
        routes_1.Routes.mountApi(this.express);
    }
    /**
     * Mounts all the defined services
     */
    mountServices() {
        shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
    }
    /**
     * Starts the express server
     */
    init() {
        const port = Locals_1.default.config().port;
        // Start the server on the specified port
        this.express.listen(port, (_error) => {
            if (_error) {
                return console.log('Error: ', _error);
            }
            return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
        });
    }
}
/** Export the express module */
exports.default = new Express();
//# sourceMappingURL=Express.js.map