import { SettingsComponent } from './settings/settings.component';
import { GetTimetableComponent } from './get-timetable/get-timetable.component';
import { Component, OnInit } from '@angular/core';
import { Session } from './session';
import { MatDialog} from '@angular/material/dialog';
import { WeeklyTableService } from './Services/WeeklyTable/weekly-table.service';
import { SessionService } from './Services/Session/session.service';
import { GeneralFunctionsService } from './Services/GeneralFunction/general-functions.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    private sessionServ: SessionService,
    private gServ: GeneralFunctionsService,
    public weeklyS: WeeklyTableService
  ) {}

  dayTitles = this.gServ.dayTitles;
  rowHeight = this.weeklyS.rowHeight;
  startTime = this.gServ.startTime;
  endTime = this.gServ.endTime;

  days = this.weeklyS.days; // default to empty arrays as each day

  dbContent: any;
  currentTable = "Main";
  tables: any;
  title = 'scheduling-app';

  times = this.weeklyS.times;

  headerContent = this.weeklyS.headerContent;

  // Functions from weekly timetable
  getAmount = this.weeklyS.getAmount;
  getHeight = this.weeklyS.getHeight;
  viewEditSession = this.weeklyS.viewEditSession;
  insertData = this.weeklyS.insertData;
  openSessionDialog = this.weeklyS.openSessionDialog;

  ngOnInit() { this.loadTable("Main");}

  loadTable = (t: string) => {
    this.sessionServ.collectionExists(t).subscribe((d) => {
      if (!d) {
        this.sessionServ.createTable(t).subscribe(() => {
          this.retrieveTable(t, this.days);
        });
      } else {
        this.retrieveTable(t, this.days);
      }
    });
  };

  retrieveTable = (t: string, days: any) => {
    this.sessionServ.retrieveTable(t).subscribe((d) => {
      this.dbContent = d;
      this.initialiseTable(this.dbContent, days);
      for (let i = 0; i < this.days.length; i++) {
        this.adjustRetrievedData(days[i].sessions);
      }
    });
  };

  initialiseTable = (d: any, days: any) => {
    days[0].sessions = d.m;
    days[1].sessions = d.t;
    days[2].sessions = d.w;
    days[3].sessions = d.th;
    days[4].sessions = d.f;
    days[5].sessions = d.s;
    days[6].sessions = d.su;
  };

  // Retrieving the data makes them a standard object and not a class, so they need to be converted
  adjustRetrievedData = (sessions: any) => {
    this.adjustDates(sessions);
    this.convertToSessionClass(sessions);
  };

  // Mongo automatically changes the dates to strings
  adjustDates = (sessions: any) => {
    for (const s of sessions) {
      s.start = new Date(s.start);
      s.end = new Date(s.end);
    }
  };

  // Converts objects to type Session...
  convertToSessionClass = (sessions: any) => {
    for (let s of sessions) {
      s = new Session(s.title, s.start, s.end, s.category, s.colour);
    }
  };

  openSettings() {
    this.dialog.open(SettingsComponent, {
      height: '80%',
      width: '60%',
      minWidth: '400px',
      minHeight: '300px',
      data: {
        getTable: this.loadTable,
        table: this.currentTable,
      },
    });
  }
}
