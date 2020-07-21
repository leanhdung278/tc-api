import Locals from '../providers/Locals';
import UserController from '../controllers/UserController';
import authorization from '../middlewares/Authorization';
import validation from '../middlewares/Validation';
import permission from '../middlewares/Permission';

import { Router } from 'express';
import { API } from '../providers/Api';
import { IRequest, IResponse, INextFunction } from '../interfaces/DefineServer';
import { UserRegister, UserBlock, UserUnlock, ChangePassword, ChangePasswordAdmin } from '../models/UserModel';

export default class UserRouter {

    public static route = `/${Locals.config().apiPrefix}/user`;
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        //CLIENT
        this.router
            .post('/register', this.client.register)
            .post('/change-password', authorization, validation(ChangePassword), this.client.changePassword)

        //ADMIN
        this.router
            .get('/am', authorization, permission(), this.admin.read)
            .post('/am/block', authorization, permission(), validation(UserBlock), this.admin.block)
            .post('/am/unlock', authorization, permission(), validation(UserUnlock), this.admin.unlock)
            .post('/am/change-password', authorization, validation(ChangePasswordAdmin), this.admin.changePassword)

    }

    //CLIENT
    private client = new class {

        async register(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data: UserRegister = req.body;
                let response = await UserController.client.register(data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async changePassword(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let { code } = req.user;
                let data: ChangePassword = req.body;
                let response = await UserController.changePassword(code, data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    }

    //ADMIN
    private admin = new class {

        async read(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let response = await UserController.admin.read(req.query);
                if (response && response.status) {
                    API.ok(req, res, response.data, response.pagination)
                } else {
                    API.badRequest(req, res, response.data);
                }
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async block(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data = req.body as UserBlock;
                let response = await UserController.admin.block(data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async unlock(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data = req.body as UserUnlock;
                let response = await UserController.admin.unlock(data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

        async changePassword(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let data: ChangePasswordAdmin = req.body;
                let { userCode } = data;
                let response = await UserController.changePassword(userCode, data);
                response && response.status ? API.ok(req, res, response.data) : API.badRequest(req, res, response.data);
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    }
};