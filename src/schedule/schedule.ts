import Interval from './interval';

class Schedule {
    public date: Date;
    public intervals: Interval[];

    constructor(date: Date, intervals: Interval[]) {
        this.date = date;
        this.intervals = intervals;
    }
}

export default Schedule;