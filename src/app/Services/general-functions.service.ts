
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeneralFunctionsService {
  constructor() {}

  rowHeight = 100;

  isInt(n: number) {
    return n % 1 == 0;
  }

  getTimeString(time: Date) {
    let m = time.getMinutes();
    let h = time.getHours();
    let x = h + ':' + (m == 0 ? '00' : m) + (h <= 12 ? ' AM' : ' PM');
    return x;
  }

  setTime(h: number, m: number) {
    let x: Date = new Date();
    x.setMinutes(m);
    x.setHours(h);
    return x;
  }

  convertDecimalPxToTime(n: number) {
    let t = Math.floor(n);
    let lMin = +(n % t).toFixed(2);
    let pxAmount = lMin * 100;
    lMin = this.convertPxToTime(pxAmount);
    return lMin;
  }

  convertPxToTime(n: number) {
    let x = 100 / n;
    let y = 60 / x;
    return Math.ceil(y);
  }

  getUMinHour(days: any, i: number) {
    // Getting the upper time limit (Till the next session)
    let tDate = new Date();
    tDate.setHours(0);
    // Will automatically increase hours
    tDate.setMinutes(this.convertPxToTime(days[i].len));
    return tDate;
  }

  convertMinToPx(n: number) {
    console.log(n)
    let x = 100 / (60 / n);

    console.log(x)
    return x;
  }

  convertHourToPx(n: number) {
    return n * this.rowHeight;
  }

  getTotalLengthInPx(t1: Date, t2: Date) {
    let x =
      this.convertHourToPx(t2.getHours()) - this.convertHourToPx(t1.getHours());
    let y =
      this.convertMinToPx(t2.getMinutes()) -
      this.convertMinToPx(t1.getMinutes());
    return y + x;
  }

  getTotalTime(n: Date) {
    return n.getHours() * 100 + this.convertMinToPx(n.getMinutes());
  }

  // Recieves 8.3 (8:30) => 8.5
  getHourTimeToPx(n: Date) {
    let s = n.getHours();
    // Get the decimal place
    let x = 100 / (60 / n.getMinutes());
    return s + x / 100;
  }

  createNewSessionObject(title: string, startTime: Date, endTime: Date, colour:string="red") {
    let obj = { t: '', s: 0, l: 0, c:'' };
    obj.t = title;
    obj.c = colour
    obj.s = this.getHourTimeToPx(startTime);
    if (startTime.getHours() == endTime.getHours()) {
      obj.l = this.convertMinToPx(endTime.getMinutes());
      return obj;
    }
    // Getting the total length by endtime-starttime
    obj.l = this.getTotalLengthInPx(startTime, endTime);
    return obj;
  }
}
