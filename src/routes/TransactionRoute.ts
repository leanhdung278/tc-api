import { Router } from 'express';
import { IRequest, IResponse, INextFunction } from '../interfaces/DefineServer';
import { API } from '../providers/Api';

import authorization from '../middlewares/Authorization';
import SliderController from '../controllers/SliderController';
import TransactionController from '../controllers/TransactionController';

export default class TransactionRouter {

    public static route = '/api/transaction';
    public router = Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {

        //CLIENT
        this.router
            .get('/', authorization, this.client.read)

        //ADMIN
        this.router
            .get('/am', authorization, this.admin.read)
            
    }

    //CLIENT
    private client = new class {

        async read(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let query = req.query;
                let { code } = req.user;
                query['userCode'] = { eq: code };
                let response = await TransactionController.read(query);
                response && response.status ? API.ok(req, res, response.data, response.pagination) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    }

    //ADMIN
    private admin = new class {

        async read(req: IRequest, res: IResponse, next: INextFunction) {
            try {
                let query = req.query;
                let response = await TransactionController.read(query);
                response && response.status ? API.ok(req, res, response.data, response.pagination) : API.badRequest(req, res, response.data)
            } catch (error) {
                API.serverError(req, res, error);
            }
        }

    }
};