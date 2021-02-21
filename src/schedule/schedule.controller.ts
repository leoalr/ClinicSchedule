import express, {Router} from 'express';
import Controller from '../interfaces/controller.interface';
import ScheduleList from './schedule-list';
import ScheduleFrequency from './schedule-frequency.enum';
import Schedule from './schedule';
import moment from 'moment';
import ScheduleResponse from './schedule-response';

class ScheduleController implements Controller {
    public path: string = '/schedule';
    public router: express.Router = Router();
    private scheduleList: ScheduleList;

    private schedule = [
        {
            "date": "26-02-2021",
            "intervals": "10:00"
        },
        {
            "date": "27-02-2021",
            "intervals": "10:00"
        }
    ];

    constructor() {
        this.initializeRoutes();
        this.scheduleList = new ScheduleList();
    }

    public initializeRoutes() {
        this.router.get(this.path, this.getSchedule);
        this.router.post(this.path, this.createASchedule);
        this.router.put(this.path + '/:scheduleDate', this.updateASchedule);
        this.router.delete(this.path + '/:scheduleDate', this.deleteASchedule);
    }
    
    getSchedule = (request: express.Request, response: express.Response) => {
        let scheduleList = this.scheduleList.GetScheduleList();
        let scheduleResponseList: ScheduleResponse[] = [];
        scheduleList.forEach((s: Schedule) => {
            scheduleResponseList.push(new ScheduleResponse(s));
        });
        response.status(200).json(scheduleResponseList);
    }
    
    createASchedule = (request: express.Request, response: express.Response) => {
        // let validationErrorMessages = this.validateRequest(request.body);
        // if (validationErrorMessages && validationErrorMessages.some(item => item)){
        //     response.json({success: false, errorMessages: validationErrorMessages, data: null});
        // }
        let {scheduleFrequency, scheduleDate, intervals} = request.body;

        let schedule = new Schedule(moment(scheduleDate, 'DD-MM-YYYY').toDate(), intervals);
        try {
            this.scheduleList.AddSchedule(schedule);
        }
        catch (e) {
            response.status(400).json({success: false, errorMessages: [(<Error>e).message]});
        }
        
        response.status(201).json({success: true, errorMessages: null, data: new ScheduleResponse(schedule)});
    }
    
    updateASchedule = (request: express.Request, response: express.Response) => {
        let {scheduleFrequency, scheduleDate, intervals} = request.body;
        let scheduleDateParam = request.params.scheduleDate;

        let schedule = new Schedule(moment(scheduleDate, 'DD-MM-YYYY').toDate(), intervals);
        try {
            this.scheduleList.ReplaceSchedule(moment(scheduleDateParam, 'DD-MM-YYYY').toDate(), schedule);
        }
        catch (e) {
            response.status(400).json({success: false, errorMessages: [(<Error>e).message]});
        }
        
        response.status(201).json({success: true, errorMessages: null, data: new ScheduleResponse(schedule)});
    }

    deleteASchedule = (request: express.Request, response: express.Response) => {
        
        let scheduleDate = request.params.scheduleDate;

        try {
            this.scheduleList.DeleteSchedule(moment(scheduleDate, 'DD-MM-YYYY').toDate());
        }
        catch (e) {
            response.status(400).json({success: false, errorMessages: [(<Error>e).message]});
        }
        
        response.status(204).json({success: true, errorMessages: null, data: null});
    }
}

export default ScheduleController;