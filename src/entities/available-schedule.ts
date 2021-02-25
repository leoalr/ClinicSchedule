import moment from 'moment';
import Interval from '../interfaces/interval.interface';

class AvailableSchedule {
    public day: string;
    public intervals: Interval[];

    constructor(day: string, intervals: Interval[]) {
        this.day = day;
        this.intervals = intervals;
    }
}

export default AvailableSchedule;