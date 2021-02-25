import fs from 'fs';
import ScheduleRule from "../interfaces/schedule-rule.interface";
import SpecificDateScheduleRule from '../entities/specific-date-schedule-rule';


const scheduleRuleFilePath = './src/data-files/schedule-rules.json';

class ScheduleRuleList {

    private readScheduleRuleListFromFile(): ScheduleRule[] {
        let fileContentString = fs.readFileSync(scheduleRuleFilePath, 'utf8');
        let scheduleArrayJson = JSON.parse(fileContentString);
        let scheduleRuleList: ScheduleRule[] = scheduleArrayJson as ScheduleRule[];
        return scheduleRuleList;
    }

    private writeScheduleRuleListToFile(scheduleList: ScheduleRule[]) {
        let scheduleRuleListJsonString = JSON.stringify(scheduleList);
        fs.writeFileSync(scheduleRuleFilePath, scheduleRuleListJsonString, 'utf8');
    }

    public getAllScheduleRules(): ScheduleRule[] {
        return this.readScheduleRuleListFromFile();
    }

    public getScheduleRuleByType(ruleType: string): ScheduleRule | undefined {
        let scheduleRuleList: ScheduleRule[] = this.readScheduleRuleListFromFile();
        return scheduleRuleList.find(s => s.ruleType === ruleType);
    }

    public doesScheduleRuleExist(ruleType: string): boolean {
        let scheduleRuleList: ScheduleRule[] = this.readScheduleRuleListFromFile();
        return !!scheduleRuleList.find(s => s.ruleType === ruleType);
    }

    public doesSpecificDateScheduleRuleExist(ruleType: string, scheduleDate: string): boolean {
        let scheduleRuleList: ScheduleRule[] = this.readScheduleRuleListFromFile();
        let specificDateScheduleRulesList: SpecificDateScheduleRule[] = (scheduleRuleList.filter(s => s.ruleType === 'SpecificDate') as SpecificDateScheduleRule[])
            .map(s => new SpecificDateScheduleRule(s.intervals, s.scheduleDate))
        return !!specificDateScheduleRulesList.find(s => s.ruleType === ruleType && s.scheduleDate === scheduleDate);
    }

    public createScheduleRule(scheduleRule: ScheduleRule) {
        let scheduleRuleList: ScheduleRule[] = this.readScheduleRuleListFromFile();
        scheduleRuleList.push(scheduleRule);
        this.writeScheduleRuleListToFile(scheduleRuleList);
    }

    public deleteScheduleRule(ruleType: string): boolean {
        let scheduleRuleList: ScheduleRule[] = this.readScheduleRuleListFromFile();
        const scheduleRulesToBeDeleted = scheduleRuleList.filter(s => s.ruleType === ruleType);
        let deleteCount: number = 0;
        if (scheduleRulesToBeDeleted.length > 0) {
            scheduleRulesToBeDeleted.forEach((s) => {
                let deletingIndex = scheduleRuleList.findIndex(s => s.ruleType === ruleType);
                scheduleRuleList.splice(deletingIndex, 1);
                deleteCount++;
            });
        }
        if (deleteCount > 0) {
            this.writeScheduleRuleListToFile(scheduleRuleList);
            return true;
        }
        else {
            return false;
        }
    }
}

export default ScheduleRuleList;