import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { WeeklyTableService } from '../Services/WeeklyTable/weekly-table.service';
@Component({
  selector: 'app-day-table',
  templateUrl: './day-table.component.html',
  styleUrls: ['./day-table.component.scss'],
})
export class DayTableComponent implements OnInit {

  getAmount = this.weeklyS.getAmount;//(ses:any,i:any,x:any) => {

  getHeight = this.weeklyS.getHeight;//(ses:any) => {this.weeklyS.getHeight(ses)}
  viewSession = this.weeklyS.viewEditSession
  insertSession = this.weeklyS.openSessionDialog

  @Input() day:any; //d: Day(String), sessions: sessions(Array of sessions)
  @Input() title:any;
  @Input() dayPos:any;

  days = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
  ]

  constructor(private weeklyS: WeeklyTableService) {}

  ngOnInit(): void {
    if(this.day==undefined){console.log("undefined")}
  }

  getFunction(session: string, i: number, day: any) {
    let x = this.days[this.dayPos];
    // Tests if blank
    if (session == '') { return this.insertSession(day, x, i, this.title); }
    return this.viewSession(day, i, x, this.title);
  }

  getColour(s:any) {
    return (s.category == "Blank") ? "lightgrey":s.colour;
  }

}
