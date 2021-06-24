
import { Component, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
  styleUrls: ['./session-dialog.component.scss'],
})
export class SessionDialogComponent implements OnInit {
  obj = {
    s: 10.5,
    t: null,
    l: 0,
    i: 0,
    day: '',
  };
  warning = '';
  break = 0
  time: Date = new Date();
  endTime: Date = new Date()
  min: Date = new Date();
  max: Date = new Date();

  constructor(
    private dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      insertSession: boolean;
      sessions: any;
      day: string;
      lHour: number;
      lMin: number;
      uHour: number;
      uMin: number;
    }
  ) {
    this.min.setHours(this.data.lHour);
    this.min.setMinutes(this.data.lMin);
    this.time.setHours(this.min.getHours());
    this.time.setMinutes(this.min.getMinutes());
    this.max.setHours(this.data.uHour);
    this.max.setMinutes(this.data.uMin+1);
    this.endTime = this.time
  }

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close(null);
  }

  changeBreak() {
    this.time.setMinutes(this.break)
  }
  something() {
    if (this.obj.t == null) {
      this.warning = 'Error: Enter in a title'
      return
    }
    if (this.data.insertSession) {
      this.checkDefaultRanges();
    } else {
      this.checkAllSessionRanges();
    }
  }

  checkAllSessionRanges() {
    let start = this.time.getHours();
    let len = this.time.getMinutes();
    for (let i = 0; i < this.data.sessions.length; i++) {
      if (this.data.sessions[i].title == '') continue;
      // Have a session to work with
      let sesh = this.data.sessions[i];
      // Ensure the start isn't at the start or within another session
      if (start >= sesh.start && start < this.getLen(sesh)) continue;

      // Since the start is good, need to check the length and that it doesn overlap
      if (start + len / 100 >= sesh.start) continue;

      this.obj.i = i > 0 ? i - 1 : 0;
      // Soon to be added to dialog
      this.obj.day = 'Monday';
      this.dialogRef.close(this.obj);
      return;
    }
    console.log('FAILED');
  }

  getLen(day: any) {
    return day.start + day.len / 100;
  }

  convertTimeToPx(n: number) {
    let x = 100 / n;
    let y = 60 / Math.floor(x);
    return Math.ceil(y);
  }

  checkDefaultRanges() {
    if (this.checkRanges(this.obj.l)) return;
    this.obj.s = this.time.getHours();
    if (this.time.getMinutes() != 0) {
      this.obj.s += this.time.getMinutes()/60;
    }
    this.obj.l = (this.endTime.getMinutes() / 60)*100 + (this.endTime.getHours()-this.time.getHours())*100;
    this.dialogRef.close(this.obj);
  }

  checkRanges(l: number) {
    this.warning = 'Error: ';
    if (this.endTime.getMinutes()-this.time.getMinutes() == 0 && this.endTime.getHours() == this.time.getHours()) {
      this.warning += ' Session needs to be longer';
      return true;
    }
    // Getting the new end time, then comparing with the max allowed time
    // let newTime: Date = new Date()
    // newTime.setHours(this.time.getHours())
    // newTime.setMinutes(this.obj.l+this.time.getMinutes())

    if (this.endTime > this.max) {
      if (this.endTime >= this.max) {
        this.obj.l-1
        return false
      }
      console.log(this.max)
      this.warning += ' Session overlaps'
      return true
    }
    return false;
  }
}
