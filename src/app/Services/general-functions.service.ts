import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeneralFunctionsService {
  constructor(private snack: MatSnackBar) {}

  startTime = this.setTime(8, 0);
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
}
