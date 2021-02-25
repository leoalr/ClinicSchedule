import ScheduleRule from "../interfaces/schedule-rule.interface";
import Interval from "../interfaces/interval.interface";

class SpecificDateScheduleRule implements ScheduleRule {
    ruleType: string = "SpecificDate";
    scheduleDate: string;
    intervals: Interval[];

    constructor(intervals: Interval[], scheduleDate: string) {
        this.intervals = intervals;
        this.scheduleDate = scheduleDate;
    }
}

export default SpecificDateScheduleRule;