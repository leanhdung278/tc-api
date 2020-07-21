import { Router } from 'express';

import UserRouter from './UserRoute';
import AuthRouter from './AuthRoute';
import PermissionRouter from './PermissionRoute';
import MailboxRouter from './MailboxRoute';
import SliderRouter from './SliderRoute';
import CashInRouter from './CashInRoute';
import TransactionRouter from './TransactionRoute';

export class Routes {

    public static mountApi(__app: Router) {
        __app.use(UserRouter.route, new UserRouter().router);
        __app.use(AuthRouter.route, new AuthRouter().router);
        __app.use(PermissionRouter.route, new PermissionRouter().router);
        __app.use(MailboxRouter.route, new MailboxRouter().router);
        __app.use(SliderRouter.route, new SliderRouter().router);
        __app.use(CashInRouter.route, new CashInRouter().router);
        __app.use(TransactionRouter.route, new TransactionRouter().router);
    }

    public static mountWeb(__app: Router) { }

}
