import ScheduleRule from "../interfaces/schedule-rule.interface";
import Interval from "../interfaces/interval.interface";

class DailyScheduleRule implements ScheduleRule {
    ruleType: string = "Daily";
    intervals: Interval[];

    constructor(intervals: Interval[]) {
        this.intervals = intervals;
    }
}

export default DailyScheduleRule;