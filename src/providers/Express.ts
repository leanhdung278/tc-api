import * as express from 'express';
import * as http from 'http';

import Locals from './Locals';
import { Routes } from '../routes/routes';
import Kernel from '../middlewares/Kernel';
import shortid = require('shortid');

class Express {
	/**
	 * Create the express object
	 */
    public express: express.Application;

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

    private mountDotEnv(): void {
        this.express = Locals.init(this.express);
    }

	/**
	 * Mounts all the defined middlewares
	 */
    private mountMiddlewares(): void {
        this.express = Kernel.init(this.express);
    }

	/**
	 * Mounts all the defined routes
	 */
    private mountRoutes(): void {
        Routes.mountWeb(this.express);
        Routes.mountApi(this.express);
    }

    /**
     * Mounts all the defined services
     */
    private mountServices(): void {
        shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@');
    }

	/**
	 * Starts the express server
	 */
    public init(): any {
        const port: number = Locals.config().port;
        // Start the server on the specified port
        this.express.listen(port, (_error: any) => {
            if (_error) {
                return console.log('Error: ', _error);
            }

            return console.log('\x1b[33m%s\x1b[0m', `Server :: Running @ 'http://localhost:${port}'`);
        });
    }
}

/** Export the express module */
export default new Express();
