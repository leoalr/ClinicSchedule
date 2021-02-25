import DailyScheduleRule from "../entities/daily-schedule-rule";
import SpecificDateScheduleRule from "../entities/specific-date-schedule-rule";
import WeeklyScheduleRule from "../entities/weekly-schedule-rule";
import Interval from "../interfaces/interval.interface";
import ScheduleRule from "../interfaces/schedule-rule.interface";
import moment from 'moment'

class ScheduleRuleFactory {

    public createScheduleRule(ruleType: string, intervals: Interval[], daysOfWeek: number[], scheduleDate: string): any {
        if (ruleType) {
            switch (ruleType.toLowerCase()) {
                case 'daily':
                    return this.createDailyScheduleRule(intervals);
                case 'weekly':
                    return this.createWeeklyScheduleRule(intervals, daysOfWeek);
                case 'specificdate':
                    return this.createSpecificDateScheduleRule(intervals, scheduleDate);
                default:
                    return undefined;
            }
        }
    }

    private createDailyScheduleRule(intervals: Interval[]): ScheduleRule {
        return new DailyScheduleRule(intervals);
    }

    private createWeeklyScheduleRule(intervals: Interval[], daysOfWeek: number[]): ScheduleRule {
        return new WeeklyScheduleRule(intervals, daysOfWeek);
    }

    private createSpecificDateScheduleRule(intervals: Interval[], scheduleDate: string): ScheduleRule {
        return new SpecificDateScheduleRule(intervals, scheduleDate);
    }
}

export default ScheduleRuleFactory;