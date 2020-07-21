import * as jwt from 'jsonwebtoken';
import * as dateformat from 'dateformat'

import ServerConfig from '../configs/ServerConfig';
import Locals from '../providers/Locals';

import { UserLogin } from '../models/UserModel';
import { User } from '../models/UserModel';

export default class AuthController {

    //CLIENT
    public static client = new class {

        public login = async (data: UserLogin) => {

            let { username, password } = data;
            let user = new User();
            let doc = await User.findOne({ username: username });

            if (doc) {
                //-Check lock
                let present = Date.now();
                if (
                    doc
                    && doc.status
                    && doc.status.lock
                    && doc.status.timeUnlock > present
                ) {
                    return {
                        status: false,
                        data: `Account locked up ${dateformat(doc.status.timeUnlock, 'dd/mm/yyyy h:MM:ss TT')}`
                    };
                }

                //-Check password
                let check = await user.comparePassword(password, doc.password);
                if (!check || !check.status) return { status: false, data: 'Incorrect password' };

                //-Sign token
                let body = { code: doc.code, username: doc.username };
                let token = await jwt.sign(body, Locals.config().appSecret, { expiresIn: Locals.config().jwtExpiresIn });

                if (!token) {
                    return {
                        status: false,
                        data: ServerConfig.STATUS.ERROR
                    };
                }

                //-Save token to database
                let response = await User.updateOne({ code: doc.code }, {
                    $set: {
                        token: token,
                        lastLogin: present
                    }
                }, {
                    new: true, omitUndefined: true
                });

                if (response.n == 1 && response.nModified == 1) {
                    doc.token = token;
                    return { status: true, data: doc };
                }

                return {
                    status: false,
                    data: ServerConfig.STATUS.ERROR
                };

            }

            return {
                status: false,
                data: 'Please check your account again'
            };

        }

        public logout = async (code: string) => {
            let response = { status: false, data: 'An error occurred' };
            let update = await User.updateOne({ code: code }, {
                $set: {
                    token: 'logout'
                }
            }, {
                new: true, omitUndefined: true
            });
            response = update.n == 1 || update.nModified == 1 ? { status: true, data: undefined } : { status: false, data: 'An error occurred' }
            return response;
        }
    }

    //ADMIN
    public static admin = new class {

    }

}