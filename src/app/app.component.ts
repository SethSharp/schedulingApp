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
  height = new Date();
  startTime = new Date();
  endTime = new Date();
  breakTime = 15;

  tempSession = new Session('', new Date(), new Date());

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
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.height.setHours(23);
    this.height.setMinutes(0);
    this.height.setSeconds(0);

    this.startTime.setHours(8);
    this.startTime.setMinutes(0);
    this.startTime.setSeconds(0);

    this.initialiseTable();

    this.tempSession = new Session('', this.startTime, this.height);
    this.endTime = this.height;
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

  getAmount = (a: Date, i: number, day: any) => {
    // Changed to start time
    let level = this.timeToPx(a.getHours());
    let t = 0;
    if (i >= 1) {
      // Gets last end position

      // Can be changed to the end time
      t = this.timeToPx(day[i - 1].start) + day[i - 1].len;
    }
    let f = (level - t).toString();
    return f;
  };

  getHeight = (s: Session) => {
    // Will require a bit more, end-start => pixels
    let h = s.end.getHours() - s.start.getHours();
    let m = s.end.getMinutes() - s.start.getMinutes();
    let y = Math.ceil(100 / (60 / m));
    let x = (h + y / 100) * 100;
    return x.toString();
  };

  // When the user clicks on a blank session. It will create a new one inserting at...
  setUpDialog = (i: number, days: any, title: string) => {
    this.openSessionDialog(days, title, days, i);
  };

  openSessionDialog = (days: any, day: string, session: any, i: number) => {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      height: '500px',
      width: '400px',
      data: {
        sessions: days,
        dayTitle: day,
        session: session[i],
        s: days[i].start,
        e: days[i].end,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.tempSession = result;
      try {
        if (result) this.insertData(i, days, result);
      } catch {}
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
    // Chaning the length of the session we are inserting at
    // end time will become the start time of the newData
    days[i].end = newData.start;
    days.splice(i + 1, 0, newData);
    // Adding in the new session, into the correct spot. After the break

    // Simply the end time of the newData
    let start = newData.end;

    if (newData.start == days[i].start) {
      // Removes blank session
      days.splice(i, 1);
      try {
        this.insertStartSesh(days, i, newData);
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
    let start = days[i + 1].end;
    if (days[i + 2].start == start) return;
    let newBlank = new Session('', start, days[i + 2].start);
    days.splice(i + 2, 0, newBlank);
  }

  insertStartSesh(day: any, i: number, s: Session) {
    if (day[i + 1].start == s.end) return;
    let newBlank = new Session('', s.end, day[i + 1].start);
    day.splice(i + 1, 0, newBlank);
  }

  insertEndSession(day: any, start: Date) {
    // Blank New Sesh (new blank or nothing)
    if (start >= this.height) return;
    // heightNeeds to have a time value (11PM)
    let newBlank = new Session('', start, this.height);
    day.push(newBlank);
  }

  insertEndSessionMatch(day: any, start: Date) {
    if (start >= this.height) return;
    let newBlank = new Session('', start, this.height);
    day.push(newBlank);
  }

  replaceSessionWithBlank(day: any, i: number) {
    // Defaulted to the day we are deleting, incase there are no surrounding blanks
    let blank = new Session('', day[i].start, day[i].end);
    //Finding the end time
    try {
      if (day[i+1].title == '') {
        blank.setEnd(day[i+1].end)
        day.splice(i+1,1)
      }
    } catch {}

    // Finding start time
    try {
      if (day[i-1].title == '') {
        blank.setStart(day[i - 1].start);
        day.splice(i - 1, 1);
        // Reduced so day[i] stays at same place
        i--
      }
   } catch {}
    day[i] = blank
  }

  // When creating a session, a blank session will fille the gaps where there are none
  // Just so its easy for the user to click on a blank session to insert a new one a that time
  addBlankSessions = (day: any) => {
    let blanks: Session[] = [];
    if (day.length == 0) {
      day.push(new Session('', this.startTime, this.height));
      return;
    }
    for (let i = 0; i < day.length; i++) {
      // break time is a const amount of time between each session, since beginning no need...
      // Beginning of day check
      if (i == 0) {
        if (day[i].start.getHours() - this.startTime.getHours() > 0) {
          if (day[i].start.getMinutes() - this.startTime.getMinutes() > 0) {
            let data = new Session('', this.startTime, day[i].start);
            blanks.push(data);
            day.splice(i,0,data)
          }
        }
      } else {
        if (day[i].start - day[i - 1].start > 0) {
          let s = day[i - 1].end;
          if (s >= this.endTime) continue;
          let data = new Session('', s, day[i].start);
          blanks.push(data);
          day.splice(i,0)
        }
      }
    }
    let i = day.length - 1;
    let e = this.height.getTime() - day[i].end.getTime()
    let data = new Session('', day[i].end, this.height);
    if (day[i].end < this.endTime) {
      blanks.push(data);
      day.push(data)
    }
    // this.insertBlanks(day, blanks);
  };

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
