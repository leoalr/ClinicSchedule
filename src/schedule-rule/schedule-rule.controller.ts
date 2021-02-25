import express, {Router} from 'express';
import Controller from '../interfaces/controller.interface';
import ScheduleRuleFactory from './schedule-rule-factory';
import ScheduleRuleList from './schedule-rule-list';
import {body, param, ValidationChain, validationResult} from 'express-validator';
import moment from 'moment';

class ScheduleRuleController implements Controller {
    public path: string = '/schedulerule';
    public router: express.Router = Router();
    scheduleRuleList: ScheduleRuleList;
    scheduleRuleFactory: ScheduleRuleFactory;

    constructor() {
        this.initializeRoutes();
        this.scheduleRuleList = new ScheduleRuleList();
        this.scheduleRuleFactory = new ScheduleRuleFactory();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getAllScheduleRules);
        this.router.post(this.path, this.validate('createScheduleRule'), this.createScheduleRule);
        this.router.delete(this.path + '/:ruleType', this.validate('deleteScheduleRule'), this.deleteScheduleRule);
    }

    getAllScheduleRules = (request: express.Request, response: express.Response) => {
        response.status(200).json(this.scheduleRuleList.getAllScheduleRules());
    }

    createScheduleRule = (request: express.Request, response: express.Response) => {
        let {ruleType, scheduleDate, daysOfWeek, intervals} = request.body;

        const validationErrors = validationResult(request);

        if (!validationErrors.isEmpty()) {
            const errorMessages = validationErrors.array().map(e => e.msg);
            response.status(400).json({ success: false, errorMessages: errorMessages});
            return;
        }

        let scheduleRule = this.scheduleRuleFactory.createScheduleRule(ruleType, intervals, daysOfWeek, scheduleDate);

        if (scheduleRule) {
            this.scheduleRuleList.createScheduleRule(scheduleRule);
        }
        else {
            console.log('not created');
        }

        response.status(201).json({success: true, errorMessages: null, data: null});
    }

    deleteScheduleRule = (request: express.Request, response: express.Response) => {
        let ruleType = request.params.ruleType;

        const validationErrors = validationResult(request);

        if (!validationErrors.isEmpty()) {
            const errorMessages = validationErrors.array().map(e => e.msg);
            response.status(400).json({ success: false, errorMessages: errorMessages});
            return;
        }

        this.scheduleRuleList.deleteScheduleRule(ruleType)
        response.status(204).end();
        return;
    }

    validate = (method: string) => {
        switch (method) {
            case 'createScheduleRule': {
                let validationRules: any[] = [];
                validationRules.push(this.validateRuleType());
                validationRules.push(this.validateIntervals());
                validationRules.push(this.validateScheduleDate());
                validationRules.push(this.validateDaysOfWeek());
                validationRules.push(this.validateDuplicatedScheduleRule());
                return validationRules;
                break;
            }
            case 'deleteScheduleRule': {
                return this.validateParamScheduleRule();
            }
            default: {
                return [];
            }
        }
    }

    validateRuleType = () => {
        return [
            body('ruleType', "The ruleType must be one of the following values: 'Daily' | 'Weekly' | 'SpecificDate'.")
            .exists().isIn(['Daily', 'Weekly', 'SpecificDate'])
        ];
    }

    validateIntervals = () => {
        return [
            body('intervals', "The intervals property must be an array with two string properties called 'start' and 'end' " +
                "whose values must follow the time format 'HH24:mm'")
                .exists().isArray(),
            body('intervals.*.start', "The 'start' property inside every item of the 'intervals' array must follow the time format: 'HH24:mm'")
                .if(body('intervals').exists().isArray())
                .exists().isString()
                .custom((value) => { 
                    const timeParts = value.trim().split(':');
                    return timeParts[0] && !isNaN(timeParts[0]) && (0 <= timeParts[0]) && (timeParts[0] <= 23) &&
                        timeParts[1] && timeParts[1].length == 2 && !isNaN(timeParts[1]) && (0 <= timeParts[1]) && (timeParts[1] <= 59);
                }),
            body('intervals.*.end', "The 'end' property inside every item of the 'intervals' array must follow the time format: 'HH24:mm'")
                .if(body('intervals').exists().isArray())
                .exists().isString()
                .custom((value) => { 
                    const timeParts = value.trim().split(':');
                    return timeParts[0] && !isNaN(timeParts[0]) && (0 <= timeParts[0]) && (timeParts[0] <= 23) &&
                        timeParts[1] && timeParts[1].length == 2 && !isNaN(timeParts[1]) && (0 <= timeParts[1]) && (timeParts[1] <= 59);
                })
        ]
    }

    validateScheduleDate = () => {
        return [
            body('scheduleDate', "The 'scheduleDate' property must be present in the date format 'DD-MM-YYYY'")
                .if(body('ruleType').exists().equals('SpecificDate'))
                .isDate({"format": "DD-MM-YYYY"})
        ]
    }

    validateDaysOfWeek = () => {
        return [
            body('daysOfWeek', "The 'daysOfWeek' property must be an array with a maximum of 7 items and each item must be a number from 1 to 7. " +
                               "The possible items values represent the days of week, being 1 for Sunday and 7 for Saturday.")
                .if(body('ruleType').exists().equals('Weekly'))
                .exists().isArray({"min": 0, "max": 7}),
            body('daysOfWeek.*', "The 'daysOfWeek' property must be an array with a maximum of 7 items and each item must be a number from 1 to 7. " +
                                 "The possible items values represent the days of week, being 1 for Sunday and 7 for Saturday.")
                .if(body('ruleType').exists().equals('Weekly'))
                .if(body('daysOfWeek').exists().isArray({"min": 0, "max": 7}))
                .isInt({"min": 1, "max": 7})
        ]
    }

    validateDuplicatedScheduleRule = () => {
        return [
            body('ruleType', 'There is already a schedule rule created for this type.')
                .if(body('ruleType').exists().isIn(['Weekly','Daily']))
                .custom((value) => !this.scheduleRuleList.doesScheduleRuleExist(value)),
            body('ruleType', 'There is already a schedule rule created for this type and date.')
                .if(body('ruleType').exists().equals('SpecificDate'))
                .custom((value, {req}) => !this.scheduleRuleList
                    .doesSpecificDateScheduleRuleExist(value, req.body.scheduleDate))
        ]
    }

    validateParamScheduleRule = () => {
        return [
            param('ruleType', "This schedule rule type is not valid. It must be one of the following values: 'Daily' | 'Weekly' | 'SpecificDate'.")
                .exists().isIn(['Daily', 'Weekly', 'SpecificDate']),
            param('ruleType', "There is no schedule rule of this type to be deleted.")
                .if(param('ruleType').exists().isIn(['Daily', 'Weekly', 'SpecificDate']))
                .custom((value) => this.scheduleRuleList.doesScheduleRuleExist(value))
        ]
    }
}

export default ScheduleRuleController;