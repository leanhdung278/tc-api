import { Router } from 'express';
import { UserLogin } from '../models/UserModel';
import { IRequest, IResponse, INextFunction } from '../interfaces/DefineServer';
import { API } from '../providers/Api';

import validation from '../middlewares/Validation';
import AuthController from '../controllers/AuthController';
import authorization from '../middlewares/Authorization';

export default class AuthRouter {

    public static route = '/api/auth';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router
            .post('/login', validation(UserLogin), this.client.login)
            .post('/logout', authorization, this.client.logout)
    }

    //CLIENT
    private client = new class {

        async login(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data: UserLogin = req.body;
                let response = await AuthController.client.login(data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async logout(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let { code } = req.user;

                if (!code) {
                    return API.badRequest(req, res, 'An error occurred');
                }

                let response = await AuthController.client.logout(code);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);

            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    }

    //ADMIN
    private admin = class {

    }
};