import { Session } from './../session';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { WeeklyTableService } from '../Services/WeeklyTable/weekly-table.service';
import { SessionService } from '../Services/Session/session.service';
import { GeneralFunctionsService } from '../Services/GeneralFunction/general-functions.service';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  constructor(
    private gServ: GeneralFunctionsService,
    private sessionServ: SessionService,
    private weeklyS: WeeklyTableService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      getTable:any;
      table:any;
    }
  ) {}

  categories: any;
  times = this.weeklyS.times;
  startTime = this.gServ.startTime
  endTime = this.gServ.endTime
  days = this.weeklyS.days;
  week = this.gServ.dayTitles
  getAmount = this.weeklyS.getAmount;
  getHeight = this.weeklyS.getHeight;
  viewEditSession = this.weeklyS.viewEditSession;
  openSessionDialog = this.weeklyS.openSessionDialog;

  ngOnInit(): void {
    this.weeklyS.observable.subscribe((d) => {
      this.categories = this.weeklyS.categories;
    });
  }

  editCategory(category: any) {
    // Edit cat in DB
    // Change cats in the all tables... maybe not know, quite a lot
    const dialogRef = this.gServ.openEditItemDialog(
      category.title,
      category.colour,
      ['Title...', 'Colour...'],
      'Edit category'
    );
    dialogRef.afterClosed().subscribe((d) => {
      try {
        this.sessionServ
          .editCategory(category, { title: d.a, colour: d.b })
          .subscribe(() => {});
      } catch {}
    });
  }

  deleteCategory(c: any, i: number) {
    this.sessionServ.deleteCategory(c.title).subscribe((d) => {
      this.categories.splice(i, 1);
    });
  }

  resetToDefault(defaultTable:string) {
    this.sessionServ.retrieveTable(defaultTable).subscribe((defaultT) => {
      if (defaultT == null) {
        this.gServ.openSnack("The table you want to swap with doesn't exist")
        return
      }
      this.sessionServ.setWeek(defaultT, this.data.table).subscribe((d)=>{
        window.location.reload()
      })
    })
  }

  resetWeek() {
    let userSchema = {
      m: [new Session('', this.startTime, this.endTime)],
      t: [new Session('', this.startTime, this.endTime)],
      w: [new Session('', this.startTime, this.endTime)],
      th: [new Session('', this.startTime, this.endTime)],
      f: [new Session('', this.startTime, this.endTime)],
      s: [new Session('', this.startTime, this.endTime)],
      su: [new Session('', this.startTime, this.endTime)],
    };
    this.sessionServ.setWeek(userSchema, this.data.table).subscribe((r)=> {
      console.log(r)
      window.location.reload()
    })
  }

  resetDay(d:string) {
    this.sessionServ.updateDay(
      new Session('',this.startTime, this.endTime),
      d,
      this.data.table
    ).subscribe((d)=>{console.log('...')})
  }
}
