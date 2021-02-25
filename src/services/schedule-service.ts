import AvailableSchedule from "../entities/available-schedule";
import ScheduleRuleList from "../schedule-rule/schedule-rule-list";
import moment from 'moment';
import Interval from "../interfaces/interval.interface";
import ScheduleRule from "../interfaces/schedule-rule.interface";
import DailyScheduleRule from "../entities/daily-schedule-rule";
import WeeklyScheduleRule from "../entities/weekly-schedule-rule";
import SpecificDateScheduleRule from "../entities/specific-date-schedule-rule";

class ScheduleService {

    rulesToSearch: {(scheduleRules: ScheduleRule[], searchingDate: moment.Moment): Interval[]}[] = [
        this.getDailyRuleAvailabilityForDate,
        this.getWeeklyRuleAvailabilityForDate,
        this.getSpecificDateRuleAvailabilityForDate
    ]

    public getAvailableScheduleForPeriod(periodStartDateString: string, periodEndDateString: string): AvailableSchedule[] {
        let scheduleRuleList = new ScheduleRuleList();

        let availableScheduleList: AvailableSchedule[] = [];

        const scheduleRules = scheduleRuleList.getAllScheduleRules();

        if (scheduleRules.length == 0) {
            return availableScheduleList;
        }
        
        let searchingDate = moment(periodStartDateString, 'DD-MM-YYYY');
        let periodEnd = moment(periodEndDateString, 'DD-MM-YYYY');
        while (searchingDate <= periodEnd)
        {
            let foundIntervals: Interval[] = [];
            let availableSchedule: AvailableSchedule = new AvailableSchedule(searchingDate.format('DD-MM-YYYY'), []);

            foundIntervals = this.getAllRulesAvailability(scheduleRules, searchingDate);

            if (foundIntervals && foundIntervals.length > 0) {
                Array.prototype.push.apply(availableSchedule.intervals, foundIntervals);
                availableScheduleList.push(availableSchedule);
            }

            searchingDate.add(1, 'd');
        }

        return availableScheduleList;
    }

    getAllRulesAvailability(scheduleRules: ScheduleRule[], searchingDate: moment.Moment): Interval[] {
        let foundIntervals: any[] = [];
        this.rulesToSearch.forEach(r => {
            const ruleIntervalsFound = r(scheduleRules, searchingDate);
            if (ruleIntervalsFound && ruleIntervalsFound.length > 0) {
                Array.prototype.push.apply(foundIntervals, ruleIntervalsFound);
            }
        });
        return foundIntervals as Interval[];
    }

    getDailyRuleAvailabilityForDate(scheduleRules: ScheduleRule[], searchingDate: moment.Moment): Interval[] {
        const dailyRule: DailyScheduleRule = scheduleRules.find(s => s.ruleType === 'Daily') as DailyScheduleRule;
        if (!dailyRule)
        {
            return [];
        }

        return dailyRule.intervals;
    }

    getWeeklyRuleAvailabilityForDate(scheduleRules: ScheduleRule[], searchingDate: moment.Moment): Interval[] {
        const weeklyRule: WeeklyScheduleRule = scheduleRules.find(s => s.ruleType === 'Weekly') as WeeklyScheduleRule;
        if (!weeklyRule)
        {
            return [];
        }

        if (weeklyRule.daysOfWeek.includes(searchingDate.day() + 1))
        {
            return weeklyRule.intervals;
        }

        return [];
    }

    getSpecificDateRuleAvailabilityForDate(scheduleRules: ScheduleRule[], searchingDate: moment.Moment): Interval[] {
        const specificDateRule: SpecificDateScheduleRule = (scheduleRules
            .filter(s => s.ruleType === 'SpecificDate') as SpecificDateScheduleRule[])
            .find(s => s.scheduleDate === searchingDate.format('DD-MM-YYYY')) as SpecificDateScheduleRule;

        if (!specificDateRule)
        {
            return [];
        }

        return specificDateRule.intervals;
    }
}

export default ScheduleService;