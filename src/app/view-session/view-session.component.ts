
import { GeneralFunctionsService } from './../Services/general-functions.service';
import { Component, OnInit, Input} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SessionDialogComponent } from '../session-dialog/session-dialog.component';
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

  constructor(
    public dialog: MatDialog,
    private dialogRef: MatDialogRef<ViewSessionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      day: any;
      i: any;
      blanks: any;
    },
    private gService: GeneralFunctionsService
  ) {
    this.pos = this.data.i;
    this.session = this.data.day[this.pos];
    this.getEndTime(this.session);
  }

  ngOnInit(): void {}


  deleteSession() {
    this.data.day.splice(this.pos, 1);
    this.dialogRef.close({ t: 'd', day: this.data.day, i: this.pos });
  }

  getEndTime(session: any) {
    let start = new Date();
    let end = new Date();
    start.setHours(session.start);
    let sMinutes = this.gService.convertDecimalPxToTime(session.start);
    start.setMinutes(sMinutes);
    start.setSeconds(0);

    let tMinutes = this.gService.convertPxToTime(session.len);
    end.setHours(start.getHours());
    end.setMinutes(tMinutes + start.getMinutes());
    end.setSeconds(0);

    this.x = start.toLocaleTimeString();
    this.x = this.x.substring(0, 4) + this.x.substring(7, this.x.length);
    this.y = end.toLocaleTimeString();
    this.y = this.y.substring(0, 4) + this.y.substring(7, this.y.length);
  }

  editSession() {
    let startTime = new Date();
    let endTime = new Date();
    let day = this.data.day;
    let i = this.pos;

    startTime.setSeconds(0);
    endTime.setSeconds(0);

    // Setting the start time
    try {
      if (day[i - 1].title == '') {
        // Prev session => blank
        startTime.setHours(day[i - 1].start);
        startTime.setMinutes(
          this.gService.getHourDecimalToMinTime(day[i - 1].start)
        );
      } else {
        // Prev session !=> blank, so start is the current time
        startTime.setHours(day[i].start);
        startTime.setMinutes(
          this.gService.getHourDecimalToMinTime(day[i].start)
        );
      }
    } catch {
      startTime.setHours(8);
      startTime.setMinutes(0);
    }

    // Setting the end time
    try {
      if (day[i + 1].title == '') {
        endTime.setHours(day[i + 1].start);
        endTime.setMinutes(
          this.gService.getHourDecimalToMinTime(day[i + 1].start)
        );
        let x = this.gService.getMinDecimalToMinTime(day[i + 1].len);
        if (x > 59) {
          let n = Math.floor(x / 60);
          let m = x % 60;
          endTime.setHours(endTime.getHours() + n);
          endTime.setMinutes(m + endTime.getMinutes());
        } else {
          endTime.setMinutes(x + endTime.getMinutes());
        }
      } else {
        // The next session is another session not a blank, so reuse that code
        throw 'exception';
      }
    } catch {
      endTime.setHours(day[i].start);
      let x = this.gService.getMinDecimalToMinTime(day[i].len);
      let y = this.gService.getHourDecimalToMinTime(day[i].start);
      endTime.setMinutes(y + x);
    }
    this.openSessionDialog(day, this.session, startTime, endTime);
  }

  openSessionDialog = (day: any, session:any, start: Date, end: Date) => {
    const dialogRef = this.dialog.open(SessionDialogComponent, {
      height: '500px',
      width: '400px',
      data: {
        sessions: day,
        dayTitle: session.title,
        startTime: start,
        endTime: end,
        session: session,
      },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result == null) return
      try { if (result) this.insertSession(this.pos, day, result); }
      catch { return; }
    });
  };

  insertSession(i:number, day:any, data:any) {
    console.log('Add');
    day.splice(i, 1, data);
    try {
      if (day[i + 1].title == '') day.splice(i + 1, 1);
      if (day[i - 1].title == '') day.splice(i - 1, 1);
    } catch {
      console.log('End session at the end of day...');
    }
    this.data.blanks(day)
  }
}
