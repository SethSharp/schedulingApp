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
  warning = '';
  title=''
  color = 'green';
  startTime: Date = new Date();
  endTime: Date = new Date();
  min: Date = new Date();
  max: Date = new Date();
  categories = this.gService.categories

  selectedCat = 'Select a category';

  constructor(
    private dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      sessions: any;
      dayTitle: string;
      session: any;
      s: Date;
      e: Date;
    },
    private gService: GeneralFunctionsService
  ) {
    this.startTime = this.data.session.start
    this.endTime = this.data.session.end
    // Not working.... but will bed used to check times
    this.min = this.data.s
    this.max = this.data.e
    this.selectedCat = this.data.session.category
    this.title = this.data.session.title
    this.color = this.data.session.colour
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
    let obj = new Session(
      this.title,
      this.startTime,
      this.endTime,
      this.selectedCat,
      this.color
    );
    this.dialogRef.close(obj);
  }

  checkRanges() {
    this.warning = 'Error: ';
    if (this.startTime == this.endTime) {
      this.warning += ' Need some length';
      return true;
    }
    if (this.selectedCat == "Blank") {
      this.warning += " Enter in a category"
      return true}
    if (this.color == 'black') {
      if (this.selectedCat.length < 6) return false
      this.warning += " Please add a category"
      return true
    }
    if (this.endTime > this.max) {
      if (this.endTime >= this.max) {
        return false;
      }
      this.warning += ' Session overlaps';
      return true;
    } else {
      if (this.endTime < this.startTime) {
        this.warning += ' Enter a time greater then: ' + this.startTime.toLocaleTimeString();
        return true;
      }
    }
    return false;
  }

  canSelectColour = true;
  setCat(c: any) {
    this.selectedCat = c.key;
    if (c.key == 'Other') {
      this.canSelectColour = false;}
    else {
      this.canSelectColour = true
      this.color = c.value
    }
  }

}
