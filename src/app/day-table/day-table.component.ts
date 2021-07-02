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
      return this.insertSession(i, day, this.title);
    }
    return this.viewSession(day, i);
  }

  getColour(s:any) {
    if (s.category == "Blank") return "lightgrey"
    return s.getColour();
  }

  getPos(s: number) {
    return (s - 8)*100;
  }
}
