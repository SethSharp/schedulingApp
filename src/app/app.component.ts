import { SessionDialogComponent } from './session-dialog/session-dialog.component';
import { Component, OnInit } from '@angular/core';
import { Session } from './session';
import { MatDialog} from '@angular/material/dialog'
import { ViewSessionComponent } from './view-session/view-session.component';
import { GeneralFunctionsService } from './Services/general-functions.service';
import { Router } from '@angular/router';

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

  tempSession = new Session('', 0, 0);

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

  constructor(
    public dialog: MatDialog,
    private gService: GeneralFunctionsService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mon.push(new Session('Test 1', 8.5, 100, 'Work'));
    this.initialiseTable();
  }

  test() {
    this.router.navigate(['/assessment']);
  }

  initialiseTable() {
    for (let i = 0; i < this.days.length; i++) {
      this.addBlankSessions(this.days[i].sessions);
    }
  }

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

  // When the user clicks on a blank session. It will create a new one inserting at...
  setUpDialog = (i: number, days: any, title: string) => {
    let startTime = new Date();
    let endTime = new Date();

    let s = days[i].start;
    startTime.setHours(s);
    startTime.setMinutes(0);
    startTime.setSeconds(0);
    let x = this.gService.isInt(s);
    if (!x) {
      startTime.setMinutes(this.gService.convertDecimalPxToTime(s));
    }

    let y = this.gService.getUMinHour(days, i);
    endTime.setHours(startTime.getHours() + y.getHours());
    let minutes = y.getMinutes() + startTime.getMinutes();
    endTime.setMinutes(minutes);

    this.openSessionDialog(days, title, startTime, endTime, days, i);
  };

  openSessionDialog = (
    days: any,
    day: string,
    start: Date,
    end: Date,
    session: any,
    i: number
  ) => {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      height: '500px',
      width: '400px',
      data: {
        sessions: days,
        dayTitle: day,
        startTime: start,
        endTime: end,
        session: session[i],
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.tempSession = result;
      try {
        if (result) this.insertData(i, days, result);
      } catch {
        return;
      }
    });
  };

  viewEditSession = (day: any, i: number) => {
    // View a session/edit the session details; time, title, notes?...
    const dialogRef = this.dialog.open(ViewSessionComponent, {
      height: '190px',
      width: '300px',
      data: { day: day, i: i, blanks: this.addBlankSessions },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == undefined) return;
      if (result.t == 'd') {
        this.replaceSessionWithBlank(result.day, result.i);
      }
    });
  };

  insertData = (i: number, days: any, newData: Session) => {
    days[i].len = this.timeToPx(newData.start) - this.timeToPx(days[i].start);
    days.splice(i + 1, 0, newData);
    // Adding in the new session, into the correct spot. After the break
    let start = this.getEndTime(newData);
    if (newData.start == days[i].start) {
      // Removes blank session
      days.splice(i, 1);
      try {
        this.insertStartSesh(days, i, start);
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

  insertStartSesh(days: any, i: number, start: number) {
    if (days[i + 1].start == start) return;
    let len = this.timeToPx(days[i + 1].start) - this.timeToPx(start);
    let newBlank = new Session('', start, len);
    days.splice(i + 1, 0, newBlank);
  }

  insertEndSession(days: any, start: number) {
    // Blank New Sesh (new blank or nothing)
    if (start >= this.endTime) return;
    let len = this.height - this.timeToPx(start);
    let newBlank = new Session('', start, len);
    days.push(newBlank);
  }

  insertEndSessionMatch(days: any, start: number) {
    if (start >= this.endTime) return;
    let len = this.height - this.timeToPx(start);
    let newBlank = new Session('', start, len);
    days.push(newBlank);
  }

  replaceSessionWithBlank(day: any, i: number) {
    try {
      if (day[i].title == '') {
        day.splice(i, 1);
      }
    } catch {}
    try {
      if (day[i - 1].title == '') {
        day.splice(i - 1, 1);
      }
    } catch {}
    this.addBlankSessions(day);
  }

  // When creating a session, a blank session will fille the gaps where there are none
  // Just so its easy for the user to click on a blank session to insert a new one a that time
  addBlankSessions = (day: any) => {
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
          if (s >= this.endTime) continue;
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
    if (s < this.endTime) {
      blanks.push(data);
    }
    this.insertBlanks(day, blanks);
  };

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
}
