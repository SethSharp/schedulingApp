import { SessionDialogComponent } from './session-dialog/session-dialog.component';

import { Component, OnInit } from '@angular/core';
import { Session } from './session';
import { MatDialog} from '@angular/material/dialog'
import { ViewSessionComponent } from './view-session/view-session.component';
import { GeneralFunctionsService } from './Services/general-functions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  // Future use some sort of storage and service
  mon: Session[] = [];
  tue: Session[] = [];
  wed: Session[] = [];
  thu: Session[] = [];
  fri: Session[] = [];
  sat: Session[] = [];
  sun: Session[] = [];

  days = [
    { d: 'Monday', sessions: this.mon },
    { d: 'Tuesday', sessions: this.tue },
    { d: 'Wednesday', sessions: this.wed },
    { d: 'Thursday', sessions: this.thu },
    { d: 'Friday', sessions: this.fri },
    { d: 'Saturday', sessions: this.sat },
    { d: 'Sunday', sessions: this.sun },
  ];

  rowHeight = 100;
  height = 1500;
  startTime = 8;
  endTime = 23;
  breakTime = 15;

  constructor(
    public dialog: MatDialog,
    private gService: GeneralFunctionsService
  ) {}

  ngOnInit(): void {
    // Temporarily adding sessions here, until modal is created
    this.initialiseTable();
  }

  initialiseTable() {
    for (let i = 0; i < this.days.length; i++) {
      this.addBlankSessions(this.days[i].sessions);
    }
  }

  times = [
    '8:00',
    '9:00',
    '10:00',
    '11:00',
    '12:00',
    '1:00',
    '2:00',
    '3:00',
    '4:00',
    '5:00',
    '6:00',
    '7:00',
    '8:00',
    '9:00',
    '10:00',
  ];
  headerContent = [
    { t: 'TIME', s: 1 },
    { t: 'MON', s: 2 },
    { t: 'TUE', s: 2 },
    { t: 'WED', s: 2 },
    { t: 'THUR', s: 2 },
    { t: 'FRI', s: 2 },
    { t: 'SAT', s: 2 },
    { t: 'SUN', s: 2 },
  ];

  timeToPx(s: number) {
    return (s - 8) * this.rowHeight;
  }

  getAmount = (a: number, i: number, day: any) => {
    let level = this.timeToPx(a);
    let t = 0;
    if (i >= 1) {
      // Gets last end position
      t = this.timeToPx(day[i - 1].start) + day[i - 1].len;
    }
    let f = (level - t).toString();
    return f;
  };

  getHeight = (s: number) => {
    return s.toString();
  };

  testSession = {
    t: '',
    s: 0,
    l: 0,
    i: 0,
    day: '',
  };

  // When the user clicks on a blank session. It will create a new one inserting at...
  insertSession = (i: number, days: any, title:string) => {
    let startTime = new Date();
    let s = days[i].start;
    startTime.setHours(s);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    let x = this.gService.isInt(s);
    console.group(s);
    if (!x) {
      console.log('HERE');
      startTime.setMinutes(this.gService.convertDecimalPxToTime(s));
    }
    let endTime = new Date();
    let y = this.gService.getUMinHour(days, i);
    endTime.setHours(startTime.getHours() + y.getHours());
    console.log(y.getMinutes());
    let minutes = y.getMinutes() + startTime.getMinutes();
    if (minutes == 60) {
      endTime.setMinutes(59);
    } else {
      endTime.setMinutes(minutes);
    }
    this.openSessionDialog(days, title, i, startTime, endTime);
  };

  openSessionDialog(
    days: any = 0,
    day: string,
    i: number = 0,
    start = new Date(),
    end = new Date()
  ) {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      height: '500px',
      width: '400px',
      data: { sessions: days, day: day, startTime: start, endTime: end },
    });
    dialogRef.afterClosed().subscribe((result) => {
      // this.testSession = result;
      try {
        let newS = new Session(result.t, result.s, result.l, result.c);
        if (this.testSession != null) this.insertData(i, days, newS);
      } catch {
        return;
      }
    });
  }

  insertData = (i: number, days: any, newData: Session) => {
    days[i].len = this.timeToPx(newData.start) - this.timeToPx(days[i].start);

    days.splice(i + 1, 0, newData);

    // Adding in the new session, into the correct spot. After the break
    let start = this.getEndTime(newData);
    if (newData.start == days[i].start) {
      // Removes blank session
      days.splice(i, 1);
      try {
        this.insertStartSesh(newData, days, i, start);
      } catch {
        this.insertEndSessionMatch(days, start);
      }
    } else {
      // Now this can be a session being inserted at the end so need a catch
      try {
        this.insertMiddleSesh(days, i);
      } catch {
        this.insertEndSession(days, start);
      }
    }
    console.log(days);
  };

  insertMiddleSesh(days: any, i: number) {
    // This is when there will be a session inserted, with a blank either side
    let nextDay = days[i + 2];
    let start = this.getEndTime(days[i + 1]);
    if (days[i + 2].start == start) return;
    let end = this.timeToPx(nextDay.start) - this.timeToPx(start);
    let newBlank = new Session('', start, end);
    days.splice(i + 2, 0, newBlank);
  }

  insertStartSesh(newData: any, days: any, i: number, start: number) {
    if (days[i + 1].start == start) return;
    let newBlank = new Session(
      '',
      start,
      this.timeToPx(days[i + 1].start) - this.timeToPx(start)
    );
    days.splice(i + 1, 0, newBlank);
  }

  insertEndSession(days: any, start: number) {
    // Blank New Sesh (new blank or nothing)
    let end = this.height - this.timeToPx(start);
    if (start >= this.endTime) return;
    let newBlank = new Session('', start, end);
    days.push(newBlank);
  }

  insertEndSessionMatch(days: any, start: number) {
    let end = this.height - this.timeToPx(start);
    let newBlank = new Session('', start, end);
    if (start >= this.endTime) return;
    days.push(newBlank);
  }

  viewEditSession = (day: any) => {
    // View a session/edit the session details; time, title, notes?...
    this.dialog.open(ViewSessionComponent, {
      height: '150px',
      width: '300px',
      data: { session: day },
    });
  };

  // When creating a session, a blank session will fille the gaps where there are none
  // Just so its easy for the user to click on a blank session to insert a new one a that time
  addBlankSessions(day: any) {
    let blanks: Session[] = [];
    if (day.length == 0) {
      day.push(new Session('', 8, 1500));
      return;
    }
    for (let i = 0; i < day.length; i++) {
      // break time is a const amount of time between each session, since beginning no need...
      // Beginning of day check
      if (i == 0) {
        if (day[i].start - this.startTime > 0) {
          let data = new Session(
            '',
            this.startTime,
            this.rowHeight * (day[i].start - this.startTime)
          );
          blanks.push(data);
        }
      } else {
        if (day[i].start - day[i - 1].start > 0) {
          let s = day[i - 1].start + day[i - 1].len / this.rowHeight;
          let a = this.timeToPx(day[i].start);
          let b = this.timeToPx(s);
          let data = new Session('', s, a - b);
          blanks.push(data);
        }
      }
    }
    let i = day.length - 1;
    let s = day[i].start + day[i].len / this.rowHeight;
    let data = new Session('', s, this.height - this.timeToPx(s));
    blanks.push(data);
    this.insertBlanks(day, blanks);
  }

  getEndTime(day: any) {
    return day.start + day.len / this.rowHeight;
  }

  insertBlanks(day: any, blanks: any) {
    for (let i = 0; i < blanks.length; i++) {
      for (let j = 0; j < day.length; j++) {
        if (day[j].start > blanks[i].start) {
          day.splice(j, 0, blanks[i]);
          break;
        }
      }
      if (blanks[i].start > day[day.length - 1].start) day.push(blanks[i]);
    }
  }

  getTimeLength(i: number, day: any) {
    let x = this.timeToPx(day[i].start);
    let y = this.timeToPx(day[i + 1].start);
    return y - x;
  }
}
