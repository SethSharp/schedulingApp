import { WeeklyTableService } from './weekly-table.service';
import { SettingsComponent } from './settings/settings.component';
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
  constructor(
    public dialog: MatDialog,
    private sessionServ: SessionService,
    private gServ: GeneralFunctionsService,
    public weeklyS: WeeklyTableService
  ) {}

  dayTitles = this.gServ.dayTitles;
  rowHeight = this.weeklyS.rowHeight;
  startTime = this.gServ.startTime
  endTime = this.gServ.endTime

  days = this.weeklyS.days

  dbContent: any;
  defaultT = 'Main';
  currentTable = '';
  tables:any;

  times = this.weeklyS.times

  headerContent = this.weeklyS.headerContent

  // Functions from weekly timetable
  getAmount = this.weeklyS.getAmount
  getHeight = this.weeklyS.getHeight
  viewEditSession = this.weeklyS.viewEditSession
  insertData = this.weeklyS.insertData
  openSessionDialog = this.weeklyS.openSessionDialog

  async ngOnInit() {
    this.changeTable()
  }

  changeTable = (days:any=this.days) => {
    this.sessionServ.retrieveAllTables().subscribe((d) => {
      this.tables = d
      let defaulted = false
      const dialogRef = this.dialog.open(GetTimetableComponent, {
        height: (this.getDialogHeight(this.tables)/10)+"%",
        width: '30%',
        minWidth: "400px",
        minHeight: "300px",
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
        this.loadTable(this.currentTable, days);
      });
    });
  }

  getDialogHeight(t:any) {
    let d = 350
    if (t.length > 5) {
      return d+(5*50)
    } return d+(t.length*50)
  }

  loadTable = (t: string, days:any) => {
    this.sessionServ.collectionExists(t).subscribe((d) => {
      if (!d) {
        this.sessionServ.createTable(t).subscribe((f)=>{
          this.retrieveTable(t, days)
        })
      } else { this.retrieveTable(t, days); }
    });
  }

  retrieveTable = (t: string, days:any) => {
    this.sessionServ.retrieveTable(t).subscribe((d) => {
      this.dbContent = d;
      this.initialiseTable(this.dbContent, days);
      for (let i = 0; i < this.days.length; i++) {
        this.adjustRetrievedData(days[i].sessions);
      }
    });
  }

  initialiseTable = (d: any, days:any) => {
    days[0].sessions = d.m;
    days[1].sessions = d.t;
    days[2].sessions = d.w;
    days[3].sessions = d.th;
    days[4].sessions = d.f;
    days[5].sessions = d.s;
    days[6].sessions = d.su;
  }

  // Retrieving the data makes them a standard object and not a class, so they need to be converted
  adjustRetrievedData = (sessions: any) => {
    this.adjustDates(sessions);
    this.convertToSessionClass(sessions);
  }

  // Mongo automatically changes the dates to strings
  adjustDates = (sessions: any) => {
    for (const s of sessions) {
      s.start = new Date(s.start);
      s.end = new Date(s.end);
    }
  }

  // Converts objects to type Session...
  convertToSessionClass = (sessions: any) => {
    for (let s of sessions) {
      s = new Session(s.title, s.start, s.end, s.category, s.colour);
    }
  }

  openToDoList() {
    this.dialog.open(ToDoListComponent, {
      width: '50%',
      height: '80%',
      minWidth: "400px",
      data: {
        tableContent: this.days,
        table: this.currentTable
      },
    });
  }

  openSettings() {
   this.dialog.open(SettingsComponent, {
     height: '80%',
     width: '60%',
     minWidth: "400px",
     minHeight: "300px",
     data: {
       getTable: this.loadTable,
       table: this.currentTable
     },
   });
  }

}
