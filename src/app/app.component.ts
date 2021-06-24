import { SessionDialogComponent } from './session-dialog/session-dialog.component';

import { Component, OnInit } from '@angular/core';
import { Session } from './session';
import { MatDialog} from '@angular/material/dialog'
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some((h) =>
    h.test(window.location.host)
  );

  // Future use some sort of storage and service
  // Use some objects to store each session (time, title, length, info etc)
  testMonday: Session[] = [];
  days: Object[] = [];
  rowHeight = 100;
  height = 1500;
  startTime = 8;
  endTime = 23;
  breakTime = 15;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    // Temporarily adding sessions here, until modal is created
    this.createSesh();
  }

  createSesh() {
    // 25 => 15, it is a percentage
    this.testMonday.push(new Session('Breakfast', 10, 16));
    this.testMonday.push(new Session('Lunch', 12, 100));
    this.testMonday.push(new Session('Dinner', 18, 120));
    this.testMonday.push(new Session('After dinner', 20, 100));
    this.sortSessions(this.testMonday);
    this.days = [{ d: 'MON', sessions: this.testMonday }];
    this.addBlankSessions(this.testMonday);
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

  lengths = [30, 60, 90];
  breaks = [5, 90, 17];

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
    day: ''
  };
  isInt(n:number) {
    return n%1==0
  }
  convertPxToTime(n:number) {
    let x = 100/n
    let y = 60/x
    return Math.ceil(y)
  }
  // When the user clicks on a blank session. It will create a new one inserting at
  insertSession = (i: number, days: any) => {
    // Ranges for the modal to stay within
    let lHour = days[i].start
    let lMin = 0
    let x = this.isInt(lHour);
    if (!x) {
      // Then it is a whole number, so a even time => 10, 11 not 10.2 or 11.8
      let t = Math.floor(lHour)
      lMin = +((lHour % t).toFixed(2))
      let pxAmount = lMin*100
      lMin = this.convertPxToTime(pxAmount)
    }
    let uHour = 21;
    let uMin = 59;
    if (days[i].len > 59) {
      let t = days[i].len%100
      uHour = Math.floor(Math.floor(days[i].len/100)+lHour)-1
      let x = +(100/t).toFixed(2)
      if ((i>0 && !this.isInt(days[i].start)) == true){
        uMin = Math.floor(60/x)+Math.ceil(this.convertPxToTime(days[i-1].len))
      }
      if (uMin >= 60) uMin=59, uHour+=1
    }
    this.openSessionDialog(true, days, "Test", i, lHour, lMin, uHour, uMin);
  };

  // Used to create a general new session, using a modal to get information
  createSession = (day:string) => {
    // Use day to pass in specific day
    this.openSessionDialog(false, this.testMonday, day)
    // Creates a session, when
  };

  openSessionDialog(type:boolean, days: any=0, day:string = '', i: number=0,
                    lHour:number=8, lMin:number=0, uHour:number=22, uMin:number=59) {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      height: '500px',
      width: '400px',
      data: { insertSession: type, sessions: days, day:day, lHour:lHour, lMin:lMin,uHour:uHour,uMin:uMin},
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.testSession = result;

      try {
        if (this.testSession != null) this.insertData(i, days);
      }
      catch {
        return
      }
    });
  }

  insertData(i: number, days: any) {
    let newData = new Session(
      this.testSession.t,
      this.testSession.s,
      this.testSession.l
    );
    days[i].len = this.timeToPx(newData.start) - this.timeToPx(days[i].start);
    // Adding in the new session, into the correct spot. After the break
    days.splice(i + 1, 0, newData);

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
  }

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

  viewEditSession = (i: number) => {
    // View a session/edit the session details; time, title, notes?...
    console.log('CLicked ' + i);
  };

  // When creating a session, a blank session will fille the gaps where there are none
  // Just so its easy for the user to click on a blank session to insert a new one a that time
  addBlankSessions(day: any) {
    let blanks: Session[] = [];
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

  // Sorts a session array based on their starting times...
  sortSessions(session: any) {
    for (let i = 0; i < session.length; i++) {
      if (session[i].title.length == 1) {
        session.splice(i, 1);
        continue;
      }
      for (let j = 0; i < session.length && i != j; j++) {
        if (session[i].start < session[j].start) {
          let temp = session[j];
          session[j] = session[i];
          session[i] = temp;
        }
      }
    }
  }
}
