import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { GetTimetableComponent } from './get-timetable/get-timetable.component';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';
import { Component, OnInit } from '@angular/core';
import { Session } from './session';
import { MatDialog} from '@angular/material/dialog'
import { ViewSessionComponent } from './view-session/view-session.component';
import { SessionService } from './session.service';
import { GeneralFunctionsService } from './Services/general-functions.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  dayTitles = this.gServ.dayTitles;
  rowHeight = 100;
  startTime = this.gServ.startTime
  endTime = this.gServ.endTime

  days = [
    { d: 'Monday', sessions: [] },
    { d: 'Tuesday', sessions: [] },
    { d: 'Wednesday', sessions: [] },
    { d: 'Thursday', sessions: [] },
    { d: 'Friday', sessions: [] },
    { d: 'Saturday', sessions: [] },
    { d: 'Sunday', sessions: [] },
  ];

  tempSession = new Session('', this.startTime, this.endTime);
  dbContent: any;
  defaultT = 'Main';
  currentTable = '';
  tables:any;

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
    { t: 'Monday', s: 2 },
    { t: 'Tuesday', s: 2 },
    { t: 'Wednesday', s: 2 },
    { t: 'Thursday', s: 2 },
    { t: 'Friday', s: 2 },
    { t: 'Saturday', s: 2 },
    { t: 'Sunday', s: 2 },
  ];

  constructor(
    public dialog: MatDialog,
    private sessionServ: SessionService,
    private gServ: GeneralFunctionsService
  ) {}

  async ngOnInit() {
    this.changeTable()
  }

  changeTable() {
    this.sessionServ.retrieveAllTables().subscribe((d) => {
      this.tables = d
      let defaulted = false
      const dialogRef = this.dialog.open(GetTimetableComponent, {
        height: this.getDialogHeight(this.tables)+"px",
        width: '400px',
        data: {
          tables: this.tables
        }
      });
      dialogRef.backdropClick().subscribe(() => {
        this.currentTable = this.defaultT;
        defaulted = true
      });
      dialogRef.afterClosed().subscribe((t) => {
        if (defaulted == false) {
          this.currentTable = t;
        }
        this.loadTable(this.currentTable);
      });
    });
  }

  getDialogHeight(t:any) {
    let d = 250
    if (t.length > 5) {
      return d+(5*50)
    } return d+(t.length*50)
  }

  loadTable(t: string) {
    this.sessionServ.collectionExists(t).subscribe((d) => {
      if (!d) {
        this.sessionServ.createTable(t).subscribe((f)=>{
          this.retrieveTable(t)
        })
      } else { this.retrieveTable(t); }
    });
    // this.gServ.openSnack('Created new timetable');
  }

  retrieveTable(t: string) {
    this.sessionServ.retrieveTable(t).subscribe((d) => {
      this.dbContent = d;
      this.initialiseTable(this.dbContent);
      for (let i = 0; i < this.days.length; i++) {
        this.adjustRetrievedData(this.days[i].sessions);
      }
    });
  }

  initialiseTable(d: any) {
    this.days[0].sessions = d.m;
    this.days[1].sessions = d.t;
    this.days[2].sessions = d.w;
    this.days[3].sessions = d.th;
    this.days[4].sessions = d.f;
    this.days[5].sessions = d.s;
    this.days[6].sessions = d.su;
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

  // When the user clicks on a blank session. It will create a new one
  openSessionDialog = (days: any, dayTitle: string, i: number) => {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      height: '70%',
      width: '40%',
      data: {
        sessions: days,
        dayTitle: dayTitle,
        session: days[i],
        s: days[i].start,
        e: days[i].end,
        table: this.currentTable,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.tempSession = result;
      try {
        if (result) this.insertData(i, days, result, dayTitle);
      } catch {}
    });
  };

  insertData = (i: number, days: any, newData: Session, t: string = '') => {
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
    this.sessionServ.updateDay(days, t, this.currentTable).subscribe(() => {});
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

  viewEditSession = (day: any, i: number, t: string) => {
    console.log(day)
    const dialogRef = this.dialog.open(ViewSessionComponent, {
      height: '190px',
      width: '300px',
      data: { day: day, i: i, insertData: this.insertData, t:t },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) return;
      if (result.t == 'd') {
        this.replaceSessionWithBlank(result.day, result.i);
      }
      console.log(result.day)
      this.sessionServ
        .updateDay(result.day, t, this.currentTable)
        .subscribe(() => {});
    });
  };

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

  // Retrieving the data makes them a standard object and not a class, so they need to be converted
  adjustRetrievedData(sessions: any) {
    this.adjustDates(sessions);
    this.convertToSessionClass(sessions);
  }

  // Mongo automatically changes the dates to strings
  adjustDates(sessions: any) {
    for (const s of sessions) {
      s.start = new Date(s.start);
      s.end = new Date(s.end);
    }
  }

  // Converts objects to type Session...
  convertToSessionClass(sessions: any) {
    for (let s of sessions) {
      s = new Session(s.title, s.start, s.end, s.category, s.colour);
    }
  }

  openToDoList(dayTitle:string="Monday") {
    this.dialog.open(ToDoListComponent, {
      width: '800px',
      height: '600px',
      data: {
        title: dayTitle,
      }
    })
  }
}
