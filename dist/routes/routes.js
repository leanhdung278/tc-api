"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const UserRoute_1 = require("./UserRoute");
const AuthRoute_1 = require("./AuthRoute");
const PermissionRoute_1 = require("./PermissionRoute");
const MailboxRoute_1 = require("./MailboxRoute");
const SliderRoute_1 = require("./SliderRoute");
const CashInRoute_1 = require("./CashInRoute");
const TransactionRoute_1 = require("./TransactionRoute");
class Routes {
    static mountApi(__app) {
        __app.use(UserRoute_1.default.route, new UserRoute_1.default().router);
        __app.use(AuthRoute_1.default.route, new AuthRoute_1.default().router);
        __app.use(PermissionRoute_1.default.route, new PermissionRoute_1.default().router);
        __app.use(MailboxRoute_1.default.route, new MailboxRoute_1.default().router);
        __app.use(SliderRoute_1.default.route, new SliderRoute_1.default().router);
        __app.use(CashInRoute_1.default.route, new CashInRoute_1.default().router);
        __app.use(TransactionRoute_1.default.route, new TransactionRoute_1.default().router);
    }
    static mountWeb(__app) { }
}
exports.Routes = Routes;
//# sourceMappingURL=routes.js.map