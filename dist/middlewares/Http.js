"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const compress = require("compression");
const bodyParser = require("body-parser");
const session = require("express-session");
const Log_1 = require("./Log");
const Locals_1 = require("../providers/Locals");
class Http {
    static mount(_express) {
        Log_1.default.info('Booting the \'HTTP\' middleware...');
        // Enables the request body parser
        _express.use(bodyParser.json({
            limit: Locals_1.default.config().maxUploadLimit
        }));
        _express.use(bodyParser.urlencoded({
            limit: Locals_1.default.config().maxUploadLimit,
            parameterLimit: Locals_1.default.config().maxParameterLimit,
            extended: false
        }));
        // Disable the x-powered-by header in response
        _express.disable('x-powered-by');
        /**
         * Enables the session store
         *
         * Note: You can also add redis-store
         * into the options object.
         */
        const options = {
            resave: true,
            saveUninitialized: true,
            secret: Locals_1.default.config().appSecret,
            cookie: {
                maxAge: 86400000 // two days (in ms)
            }
        };
        _express.use(session(options));
        // Enables the CORS
        _express.use(cors());
        // Enables the "gzip" / "deflate" compression for response
        _express.use(compress());
        return _express;
    }
}
exports.default = Http;
//# sourceMappingURL=Http.js.map