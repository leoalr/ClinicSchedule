import express from 'express';
import Controller from '../interfaces/controller.interface';

class Routes {
    public app: express.Application;

    constructor(app: express.Application, controllers: Controller[]) {
        this.app = app;
        this.initializeControllersRoutes(controllers);
    }

    private initializeControllersRoutes(controllers:Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/', controller.router);
        });
    }
};

export default Routes;