import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EditItemComponent } from 'src/app/edit-item/edit-item.component';
@Injectable({
  providedIn: 'root',
})
export class GeneralFunctionsService {
  constructor(private snack: MatSnackBar, private dialog: MatDialog) {}

  startTime = this.setTime(6, 0);
  endTime = this.setTime(23, 0);
  rowHeight = 100;
  dayTitles = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  categories = {
    Food: '#00fff3',
    Study: '#09ff00',
    Work: '#ff6c00',
    Other: '#4800ff',
  };

  setTime(h: number, m: number) {
    let x: Date = new Date();
    x.setMinutes(m);
    x.setHours(h);
    x.setSeconds(0);
    return x;
  }

  xIsGreaterThanY(t1: Date, t2: Date) {
    if (t1.getHours() >= t2.getHours()) {
      return t1.getMinutes() >= t2.getMinutes();
    }
    return false;
  }

  openSnack(message: string, alert:string="Dismiss") {
    this.snack.open(message, alert, {
      duration: 4000,
    });
  }

  xIsEqualToY(t1:Date,t2:Date) {
    if (t1.getHours() == t2.getHours()) {
      return t1.getMinutes() == t2.getMinutes()
    }
    return false
  }

  openEditItemDialog(a:any, b:any, info:any, title:any) {
    return this.dialog.open(EditItemComponent, {
      width: '30%',
      height: '40%',
      minWidth: "200px",
      minHeight: "325px",
      data: {
        a: a,
        b: b,
        info: info,
        title: title,
      },
    });
  }
}
