import { Session } from './../session';
import { GeneralFunctionsService } from './../Services/general-functions.service';

import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA , MatDialogRef } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { SessionService } from '../session.service';
import { EditItemComponent } from '../edit-item/edit-item.component';
@Component({
  selector: 'app-session-dialog',
  templateUrl: './session-dialog.component.html',
  styleUrls: ['./session-dialog.component.scss'],
})
export class SessionDialogComponent implements OnInit {
  warning = '';
  title = '';
  color = 'green';
  startTime: Date = new Date();
  endTime: Date = new Date();
  min: Date = new Date();
  max: Date = new Date();
  nMin: Date = new Date();
  nMax: Date = new Date();
  categories:any;

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
      table: string;
    },
    private gService: GeneralFunctionsService,
    private dialog: MatDialog,
    private sessionServ: SessionService
  ) {
    this.startTime = this.data.session.start;
    this.endTime = this.data.session.end;
    this.min = this.data.s;
    this.max = this.data.e;
    this.nMin = this.data.s;
    this.nMax = this.data.e;
    this.selectedCat = this.data.session.category;
    this.title = this.data.session.title;
    this.color = this.data.session.colour;
    this.sessionServ.getCategories().subscribe(d => {
      this.categories = d
      this.categories.push({title:'Custom'})
    })
  }

  ngOnInit(): void {}

  cancel() {
    this.dialogRef.close(null);
  }

  submitSessionBlock() {
    if (this.checkRanges()) {
      this.gService.openSnack(this.warning);
      return
    };
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

  canSelectColour = true;
  setCat(c: any) {
    this.selectedCat = c.title;
    if (this.selectedCat == 'Other') {
      this.canSelectColour = false;
    } else {
      this.canSelectColour = true;
      this.color = c.colour;
    }
  }

  customCategory() {
    // Open a dialog with the info, then return the cat and set the current cat to
    // the one created
    console.log("opened custom cat")
    const dialogRef = this.dialog.open(EditItemComponent, {
      width: '500px',
      height: '300px',
      data: {
        a: "",
        b: "",
        info: ["Name...", "Colour..."],
        title: "Create new category"
      },
    });
    dialogRef.afterClosed().subscribe((d) => {
      try {
        this.sessionServ.addCategory({title:d.a, colour:d.b}).subscribe((c) => {
          this.setCat({title:d.a, colour:d.b})
          this.categories.push({title:d.a, colour:d.a})
        })
      } catch {
        // console.log("Exited without submitting")
      }
    });
  }
}
