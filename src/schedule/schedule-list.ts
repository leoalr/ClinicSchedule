import fs from 'fs';
import Schedule from './schedule';

const scheduleFilePath = './src/data-files/schedule.json';

class ScheduleList {

    constructor() {

    }

    private ReadScheduleListFromFile(): Schedule[] {
        let fileContentString = fs.readFileSync(scheduleFilePath, 'utf8');
        let scheduleArrayJson = JSON.parse(fileContentString);
        let scheduleList: Schedule[] = [];
        scheduleArrayJson.forEach((scheduleJson: any) => {
            scheduleList.push(new Schedule(new Date(scheduleJson.date), scheduleJson.intervals))
        });
        return scheduleList;
    }

    private WriteScheduleListToFile(scheduleList: Schedule[]) {
        let scheduleListJsonString = JSON.stringify(scheduleList);
        fs.writeFileSync(scheduleFilePath, scheduleListJsonString, 'utf8');
    }

    public GetScheduleList(): Schedule[] {
        return this.ReadScheduleListFromFile();
    }

    public AddSchedule(schedule: Schedule) {
        if (this.DoesScheduleAlreadyExist(schedule)) {
            throw new Error("The schedule already exists");
        }
        let scheduleList = this.ReadScheduleListFromFile();
        scheduleList.push(schedule);
        this.WriteScheduleListToFile(scheduleList);
    }

    public ReplaceSchedule(scheduleDate: Date, schedule: Schedule) {
        if (!this.DoesScheduleDateAlreadyExist(scheduleDate)) {
            throw new Error("There is no schedule to be changed.");
        }
        let scheduleList = this.ReadScheduleListFromFile();
        let itemIndex = scheduleList.findIndex(item => item.date.getTime() === scheduleDate.getTime());
        scheduleList[itemIndex] = schedule;
        this.WriteScheduleListToFile(scheduleList);
    }

    public DeleteSchedule(scheduleDate: Date) {
        if (!this.DoesScheduleDateAlreadyExist(scheduleDate)) {
            throw new Error("There is no schedule to be deleted.");
        }
        let scheduleList = this.ReadScheduleListFromFile();
        let itemIndex = scheduleList.findIndex(item => item.date.getTime() === scheduleDate.getTime());
        scheduleList.splice(itemIndex, 1);
        this.WriteScheduleListToFile(scheduleList);
    }

    public DoesScheduleAlreadyExist(schedule: Schedule): Boolean {
        let scheduleList = this.ReadScheduleListFromFile();
        let alreadyExistingSchedule = scheduleList.find(item => item.date.getTime() === schedule.date.getTime());
        if (alreadyExistingSchedule) {
            return true;
        }
        else {
            return false;
        }
    }

    public DoesScheduleDateAlreadyExist(scheduleDate: Date) {
        let scheduleList = this.ReadScheduleListFromFile();
        let alreadyExistingSchedule = scheduleList.find(item => item.date.getTime() === scheduleDate.getTime());
        if (alreadyExistingSchedule) {
            return true;
        }
        else {
            return false;
        }
    }

    public SaveScheduleList(scheduleList: Schedule[]) {
        this.WriteScheduleListToFile(scheduleList);
    }
}

export default ScheduleList;