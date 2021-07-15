import { Injectable } from '@angular/core';
import { Session } from './session';
import { MatDialog } from '@angular/material/dialog';
import { ViewSessionComponent } from './view-session/view-session.component';
import { GeneralFunctionsService } from './Services/general-functions.service';
import { SessionService } from './session.service';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';


@Injectable({
  providedIn: 'root',
})
export class WeeklyTableService {
  rowHeight = 100;
  defaultT = 'Main';
  endTime = this.gServ.endTime;
  startTime = this.gServ.startTime;
  tempSession = new Session('', this.startTime, this.endTime);

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

  days = [
    { d: 'Monday', sessions: [] },
    { d: 'Tuesday', sessions: [] },
    { d: 'Wednesday', sessions: [] },
    { d: 'Thursday', sessions: [] },
    { d: 'Friday', sessions: [] },
    { d: 'Saturday', sessions: [] },
    { d: 'Sunday', sessions: [] },
  ];

  headerContent = [
    { t: 'TIME', s: 1 },
    { t: 'Monday', s: 2 },
    { t: 'Tuesday', s: 2 },
    { t: 'Wednesday', s: 2 },
    { t: 'Thursday', s: 2 },
    { t: 'Friday', s: 2 },
    { t: 'Saturday', s: 2 },
    { t: 'Sunday', s: 2 },
  ];

  constructor(
    private dialog: MatDialog,
    private gServ: GeneralFunctionsService,
    private sessionServ: SessionService
  ) {}

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

  viewEditSession = (day: any, i: number, dayTitle: string, table:string) => {
    const dialogRef = this.dialog.open(ViewSessionComponent, {
      height: '55%',
      width: '30%',
      minWidth: "200px",
      minHeight: "250px",
      data: { day: day, i: i, insertData: this.insertData, t: dayTitle },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) return;
      if (result.t == 'd') {
        this.replaceSessionWithBlank(result.day, result.i);
      }
      this.sessionServ
        .updateDay(result.day, dayTitle, table)
        .subscribe(() => {});
    });
  };

  insertData = (i: number, days: any, newData: Session, dayTitle: string, table:string) => {
    // Changing the length of the session we are inserting at
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
    this.sessionServ.updateDay(days, dayTitle, table).subscribe(() => {});
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
    if (this.gServ.xIsGreaterThanY(start, this.endTime)) return;
    // heightNeeds to have a time value (11PM)
    let newBlank = new Session('', start, this.endTime);
    day.push(newBlank);
  }

  insertEndSessionMatch(day: any, start: Date) {
    if (this.gServ.xIsGreaterThanY(start, this.endTime)) return;
    let newBlank = new Session('', start, this.endTime);
    day.push(newBlank);
  }

  replaceSessionWithBlank(day: any, i: number) {
    // Defaulted to the day we are deleting, incase there are no surrounding blanks
    let blank = new Session('', day[i].start, day[i].end);
    //Finding the end time
    try {
      if (day[i + 1].title == '') {
        blank.setEnd(day[i + 1].end);
        day.splice(i + 1, 1);
      }
    } catch {}

    // Finding start time
    try {
      if (day[i - 1].title == '') {
        blank.setStart(day[i - 1].start);
        day.splice(i - 1, 1);
        // Reduced so day[i] stays at same place
        i--;
      }
    } catch {}
    day[i] = blank;
  }

  // When the user clicks on a blank session. It will create a new one
  openSessionDialog = (days: any, dayTitle: string, i: number, table:string) => {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      height: '60%',
      width: '30%',
      minHeight: "400px",
      minWidth: "300px",
      data: {
        sessions: days,
        dayTitle: dayTitle,
        session: days[i],
        s: days[i].start,
        e: days[i].end,
        table: table,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.tempSession = result;
      try {
        if (result) this.insertData(i, days, result, dayTitle, table);
      } catch {}
    });
  };
}
