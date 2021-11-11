import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { WeeklyTableService } from '../Services/WeeklyTable/weekly-table.service';
@Component({
  selector: 'app-day-table',
  templateUrl: './day-table.component.html',
  styleUrls: ['./day-table.component.scss'],
})
export class DayTableComponent implements OnInit {

  getAmount = this.weeklyS.getAmount
  getHeight = this.weeklyS.getHeight
  viewSession = this.weeklyS.viewEditSession
  insertSession = this.weeklyS.openSessionDialog

  @Input() day:any;
  @Input() title:any;
  @Input() dayPos:any;

  days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]

  constructor(private weeklyS: WeeklyTableService) {}

  ngOnInit(): void {}

  getFunction(blank: string, i: number, day: any) {
    let x = this.days[this.dayPos];
    // Tests if blank
    if (blank=='') {
      return this.insertSession(day, x, i, this.title);
    }
    return this.viewSession(day, i, x, this.title);
  }

  getColour(s:any) {
    if (s.category == "Blank") return "lightgrey"
    return s.colour;
  }

  getDesc(cat:string) {
    if (cat == "Blank") {
      return ''
    }
    return cat
  }

}
