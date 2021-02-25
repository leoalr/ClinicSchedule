import express, {Router} from 'express';
import Controller from '../interfaces/controller.interface';
import {query, ValidationChain, validationResult} from 'express-validator';
import ScheduleService from '../services/schedule-service';

class ScheduleController implements Controller {
    public path: string = '/schedule';
    public router: express.Router = Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.validate('getSchedule'), this.getSchedule);
    }
    
    getSchedule = (request: express.Request, response: express.Response) => {
        const validationErrors = validationResult(request);

        if (!validationErrors.isEmpty()) {
            const errorMessages = validationErrors.array().map(e => e.msg);
            response.status(400).json({ success: false, errorMessages: errorMessages});
            return;
        }

        const scheduleService = new ScheduleService();
        const availableSchedule = scheduleService.getAvailableScheduleForPeriod(request.query.searchingPeriodStart as string, request.query.searchingPeriodEnd as string);

        response.status(200).json(availableSchedule);
    }

    validate = (method: string) => {
        switch (method) {
            case 'getSchedule': {
                let validationRules: any[] = [];
                validationRules.push(this.validateQueryParamsSchedulePeriod());
                return validationRules;
                break;
            }
            default: {
                return [];
            }
        }
    }

    validateQueryParamsSchedulePeriod = () => {
        return [
            query('searchingPeriodStart', "The 'searchingPeriodStart' query parameter must be a valid date in the format 'DD-MM-YYYY'.")
                .isDate({"format": "DD-MM-YYYY"}),
            query('searchingPeriodEnd', "The 'searchingPeriodEnd' query parameter must be a valid date in the format 'DD-MM-YYYY'.")
                .isDate({"format": "DD-MM-YYYY"})
        ]
    }
}

export default ScheduleController;