
import { GeneralFunctionsService } from './../Services/general-functions.service';
import { Component, OnInit, Input} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SessionDialogComponent } from '../session-dialog/session-dialog.component';
import { Session } from '../session'
@Component({
  selector: 'app-view-session',
  templateUrl: './view-session.component.html',
  styleUrls: ['./view-session.component.scss'],
})
export class ViewSessionComponent implements OnInit {
  x = '';
  y = '';
  pos = 0;
  session: any;
  height = new Date
  startTime = new Date
  ogStart = new Date
  ogEnd = new Date

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewSessionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      day: any;
      i: any;
      blanks: any;
    },
  ) {
    this.pos = this.data.i;
    this.session = this.data.day[this.pos];
    this.x = this.session.start.toLocaleTimeString();
    this.y = this.session.end.toLocaleTimeString();
  }

  ngOnInit(): void {
    this.height.setHours(23);
    this.height.setMinutes(0);
    this.height.setSeconds(0);

    this.startTime.setHours(8);
    this.startTime.setMinutes(0);
    this.startTime.setSeconds(0);
  }

  deleteSession() {
    this.dialogRef.close({ t: 'd', day: this.data.day, i: this.pos });
  }

  editSession() {
    let day = this.data.day;
    let i = this.pos;

    let startTime = day[i].start;
    let endTime = day[i].end;

    try {
      if (day[i - 1].title == '') {
        startTime = day[i - 1].start;
        console.log('EHH');
      }
    } catch {} // start time already set to the beginning of the session

    try {
      if (day[i + 1].title == '') {
        endTime = day[i + 1].end;
        console.log('HERE');
      }
    } catch {} // Same as before, uses endtime default time
    startTime.setSeconds(0)
    endTime.setSeconds(0)
    this.ogStart = startTime
    this.ogEnd = endTime

    this.openSessionDialog(day, this.session, startTime, endTime);
  }

  openSessionDialog = (day: any, session: any, start: Date, end: Date) => {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      height: '500px',
      width: '400px',
      data: {
        sessions: day,
        dayTitle: session.title,
        s: start,
        e: end,
        session: session,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) return;
      try {
        if (result) this.adjustSessions(this.pos, day, result);
      } catch {
        return;
      }
    });
  };

  adjustSessions(i: number, day: any, newData: any) {
    try {
      if (day[i+1].title == '') {
        day[i+1].start = newData.end
      }
    } catch {}
    try {
      if (day[i-1].title == '') {
        day[i-1].end = newData.start
      }
    } catch {}

    day.splice(i,1,newData)

    if (newData.start != this.ogStart) {
      try {
        if (day[i+1].title == '') {
          day[i+1].setStart(newData.end)
        }
      } catch { // end of the day
        let sesh = new Session('',newData.end, this.height)
        day.push(sesh)
      }
    }

    if (this.ogEnd != newData.end) {
      try {
      if (day[i-1].title == '') {
        day[i-1].setEnd(newData.start)
      }
      } catch {
        let sesh = new Session('',this.startTime,newData.end)
        day.splice(0,1,sesh)
      }
    }
    this.dialogRef.close()
  }
}
