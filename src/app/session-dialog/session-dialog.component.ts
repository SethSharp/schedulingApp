import { Session } from './../session';
import { GeneralFunctionsService } from './../Services/general-functions.service';

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
  title = '';
  warning = '';
  break = 0;
  originalStart = 0;
  color = '#2b00ff';
  startTime: Date = new Date();
  endTime: Date = new Date();
  min: Date = new Date();
  max: Date = new Date();

  constructor(
    private dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      sessions: any;
      day: string;
      startTime: Date;
      endTime: Date;
    },
    private gService: GeneralFunctionsService
  ) {
    this.min = this.data.startTime;
    this.startTime = this.gService.setTime(
      this.min.getHours(),
      this.min.getMinutes()
    );
    this.max = this.data.endTime;
    this.endTime = this.startTime;
    this.originalStart = this.startTime.getMinutes();
  }

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close(null);
  }

  submitSessionBlock() {
    if (this.title == '') {
      this.warning = 'Error: Enter in a title';
      return;
    }
    if (this.checkRanges()) return;
    let obj = this.gService.createNewSessionObject(
      this.title,
      this.startTime,
      this.endTime,
      this.color
    );
    this.dialogRef.close(obj);
  }

  changeBreak() {
    this.startTime.setMinutes(this.originalStart + this.break);
  }

  checkRanges() {
    this.warning = 'Error: ';
    if (this.startTime == this.endTime) {
      console.log('EQUAL');
      this.warning += ' Need some length';
      return true;
    }
    if (this.endTime > this.max) {
      if (this.endTime >= this.max) {
        //this.obj.l - 1;
        return false;
      }
      console.log('...');
      this.warning += ' Session overlaps';
      return true;
    } else {
      if (this.endTime < this.startTime) {
        let x = this.gService.getTimeString(this.startTime);
        this.warning += ' Enter a time greater then: ' + x;
        return true;
      }
    }
    return false;
  }
}
