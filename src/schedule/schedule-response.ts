import moment from 'moment';
import Schedule from './schedule';

class ScheduleResponse {
    public day: string;
    public intervals: {start: string, end: string}[];

    constructor(schedule: Schedule) {
        this.day = moment(schedule.date).format("DD-MM-YYYY");
        this.intervals = schedule.intervals;
    }
}

export default ScheduleResponse;