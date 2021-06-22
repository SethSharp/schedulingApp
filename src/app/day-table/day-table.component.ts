import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatCard } from '@angular/material/card';

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

  constructor() {}

  ngOnInit(): void {console.log(this.day)}

  getFunction(title: string, i: number, day: any) {
    if (title.length == 1) {
      return this.insertSession(i, day);
    }
    return this.viewSession(i);
  }

  getColour(t: string) {
    if (t.length == 1) {
      return 'green';
    }
    return 'red';
  }

  getPos(s: number) {
    return (s - 8)*100;
  }
}
