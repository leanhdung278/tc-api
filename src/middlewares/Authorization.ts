import * as jwt from "jsonwebtoken";
import * as dateFormat from "dateformat";

import { IRequest, IResponse, INextFunction, DataStoredInToken } from "../interfaces/DefineServer";
import { IUser } from "../interfaces/DefineModel";
import { API } from "../providers/Api";

import UserController from "../controllers/UserController";
import Locals from "../providers/Locals";
import Log from "./Log";

/**
 * @step1 Get token in headers
 * @step2 Verify token and find account in the database with code decryption and check token
 * @step3 Check user is block
 * @step4 Attach to request
 */
async function authorization(req: IRequest, res: IResponse, next: INextFunction) {
    try {

        let { authorization } = req.headers;
        let decoded = await jwt.verify(authorization, Locals.config().appSecret) as DataStoredInToken;
        
        //-Find user by code
        let user: IUser = await UserController.findOneUser({
            isActive: true,
            code: decoded.code,
            username: decoded.username
        });

        if (!user) {
            return API.badRequest(req, res, 'Authentication failed');
        }

        //-Check token
        if (authorization != user.token) {
            API.badRequest(req, res, 'Token missing');
        } else {
            //-Check lock
            let present = Date.now();
            if (
                user
                && user.status
                && user.status.lock
                && user.status.timeUnlock > present
            ) {
                return API.badRequest(req, res, `Account locked up ${dateFormat(user.status.timeUnlock, 'dd/mm/yyyy h:MM:ss TT')}`);
            }
            else {
                //-Attach user to request
                req.user = user;
                next();
            }
        }

    } catch (error) {

        //Log error
        let { hostname, originalUrl, method } = req;
        Log.error(`HOST: ${hostname} - PATH: ${originalUrl} - METHOD: ${method} - ERROR_MESSAGE: ${error.message} - STACKTRACE: ${error.stacktrace}`);

        //Sent
        API.badRequest(req, res, 'Authentication failed');

    }
}

export default authorization;
