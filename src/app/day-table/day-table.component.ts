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
  @Input() dayPos: any;

  days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]

  constructor() {}

  ngOnInit(): void {}

  getFunction(title: string, i: number, day: any) {
    let x = this.days[this.dayPos];
    if (title=='') {
      return this.insertSession(day, this.title, i);
    }
    return this.viewSession(day, i, x);
  }

  getColour(s:any) {
    if (s.category == "Blank") return "lightgrey"
    return s.colour;
  }

}
