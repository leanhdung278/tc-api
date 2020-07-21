"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("./providers/App");
/**
 * Run the Database pool
 */
App_1.default.loadDatabase();
/**
 * Run the Server on Clusters
 */
App_1.default.loadServer();
//# sourceMappingURL=server.js.map