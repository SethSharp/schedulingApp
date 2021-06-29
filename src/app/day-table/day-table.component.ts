import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-day-table',
  templateUrl: './day-table.component.html',
  styleUrls: ['./day-table.component.scss'],
})
export class DayTableComponent implements OnInit {
  @Input() day: any;
  @Input() getAmount: any;
  @Input() getHeight: any;
  @Input() viewSession: any;
  @Input() insertSession: any;
  @Input() title: any;

  constructor() {}

  ngOnInit(): void {}

  getFunction(title: string, i: number, day: any) {
    if (title=='') {
      console.log(day)
      return this.insertSession(i, day, this.title);
    }
    return this.viewSession(day[i]);
  }

  getTitle(d:number) {
    switch (d) {
      case 0:
        return 'Monday';
        break;
      case 1:
        return 'Tuesday';
        break;
      case 2:
        return 'Wednesday';
        break;
      case 3:
        return 'Thursday';
        break;
      case 4:
        return 'Friday';
        break;
      case 5:
        return 'Saturday';
        break;
      default:
        return "Sunday"
        break;
    }
  }

  getColour(s:any) {
    if (s.title=='') {
      return '#e0e0e0';
    }
    return s.colour;
  }

  getPos(s: number) {
    return (s - 8)*100;
  }
}
