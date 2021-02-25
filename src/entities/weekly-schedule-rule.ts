import ScheduleRule from "../interfaces/schedule-rule.interface";
import Interval from "../interfaces/interval.interface";

class WeeklyScheduleRule implements ScheduleRule {
    ruleType: string = "Weekly";
    daysOfWeek: number[];
    intervals: Interval[];

    constructor(intervals: Interval[], daysOfWeek: number[]) {
        this.intervals = intervals;
        this.daysOfWeek = daysOfWeek;
    }
}

export default WeeklyScheduleRule;