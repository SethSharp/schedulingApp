import { Session } from './../session';

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA , MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '../Services/Session/session.service';
import { WeeklyTableService } from '../Services/WeeklyTable/weekly-table.service';
import { GeneralFunctionsService } from '../Services/GeneralFunction/general-functions.service';

@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
  styleUrls: ['./session-dialog.component.scss'],
})
export class SessionDialogComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<SessionDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      sessions: any;
      dayTitle: string;
      session: any;
      s: Date;
      e: Date;
      table: string;
      categories: any;
    },
    private gService: GeneralFunctionsService,
    private dialog: MatDialog,
    private sessionServ: SessionService,
    private weeklyS: WeeklyTableService
  ) {
    this.categories = this.data.categories;
    this.startTime = this.data.session.start;
    this.endTime = this.data.session.end;
    this.min = this.data.s;
    this.max = this.data.e;
    this.nMin = this.data.s;
    this.nMax = this.data.e;
    this.selectedCat = this.data.session.category;
    this.title = this.data.session.title;
    this.color = this.data.session.colour;
  }

  warning = '';
  title = '';
  color = 'green';
  startTime: Date = this.gService.startTime;
  endTime: Date = this.gService.endTime;
  min: Date = new Date();
  max: Date = new Date();
  nMin: Date = new Date();
  nMax: Date = new Date();
  categories: any;

  selectedCat = 'Select a category';

  ngOnInit(): void {}

  submitSessionBlock() {
    if (this.checkRanges()) {
      this.gService.openSnack(this.warning);
      return;
    }
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
    if (this.title == '') {
      this.warning += ' Enter in a title';
      return true;
    }
    if (this.startTime == this.endTime) {
      this.warning += ' Need some length';
      return true;
    }
    if (this.selectedCat == 'Blank') {
      this.warning += ' Enter in a category';
      return true;
    }
    if (this.color == 'black') {
      if (this.selectedCat.length < 6) return false;
      this.warning += ' Please add a category';
      return true;
    }
    return false;
  }

  changeMin() {
    this.nMin = this.startTime;
  }

  changeMax() {
    this.nMax = this.endTime;
  }

  setCat(c: any) {
    this.selectedCat = c.title;
    this.color = c.colour;
  }

  customCategory() {
    // Open a dialog with the info, then return the cat and set the current cat to
    // the one created
    const dialogRef = this.gService.openEditItemDialog(
      '',
      '',
      ['Name...', 'Colour...'],
      'Create new category'
    );

    dialogRef.afterClosed().subscribe((d) => {
      try {
        this.sessionServ
          .addCategory({ title: d.a, colour: d.b })
          .subscribe((c) => {
            this.setCat({ title: d.a, colour: d.b });
            this.categories.push({ title: d.a, colour: d.a });
          });
      } catch {}
    });
  }
}
