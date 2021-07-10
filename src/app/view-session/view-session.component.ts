
import { GeneralFunctionsService } from './../Services/general-functions.service';
import { Component, OnInit, Input} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SessionDialogComponent } from '../session-dialog/session-dialog.component';
import { Session } from '../session'
import { splitClasses } from '@angular/compiler';
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
    this.ogStart = startTime
    this.ogEnd = endTime
    try {
      if (day[i - 1].title == '') {
        startTime = day[i - 1].start;

      }
    } catch {} // start time already set to the beginning of the session

    try {
      if (day[i + 1].title == '') {
        endTime = day[i + 1].end;

      }
    } catch {} // Same as before, uses end time default time
    startTime.setSeconds(0)
    endTime.setSeconds(0)



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
        if (result) {
          this.adjustSessions(this.pos, day, result);}
      } catch {
        return;
      }
    });
  };

  adjustSessions(i: number, day: any, newData: any) {
    day[i] = newData
    if (newData.end != this.ogEnd) {
      try {
        let d = day[i+1]  // There is a session after the edited one
        // So its start needs to be reset
        if (d.title == '') {
          d.setStart(newData.end)
          if (newData.end.getHours() == this.height.getHours()) {
            if (newData.end.getMinutes() == this.height.getMinutes()){
              day.pop()
            }
          }
        } else {
          if (newData.end < this.height) {
            if (d.start < this.height) {
              day.splice(i,0, new Session('', newData.end, d.start))
            }
          }
        }
        console.log('1')
      } catch { // This case means that the next session doesn't exist, so the end
        if (newData.end < this.height) { // Then there can be an end session
          day.push(new Session('', newData.end, this.height))
        }
        console.log('2');
      }
    }

    if (this.ogStart != newData.start) {
      console.log(this.ogStart, newData.start)
      try {
        let d = day[i-1] // There is a session prior to the edited one
        if (d.title == '') {
          if (newData.start == this.height) {
            day.splice(0,1)
            console.log("equal")
          } else {
            d.setEnd(newData.start)
          }

        } else {
          day.splice(i,0, new Session('',d.end, newData.start))
        }

        console.log('3');
      } catch {
        if (newData.start > this.startTime) {
            day.splice(0,0, new Session('', this.startTime, newData.start))
        } else {
          day.splice(0,1)
        }
        console.log('4');
      }
    }

    this.dialogRef.close({t:'', day: day})
  }
}
