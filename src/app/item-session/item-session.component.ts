
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Session } from "../session";
import { WeeklyTableService } from '../Services/WeeklyTable/weekly-table.service';
@Component({
  selector: 'app-item-session',
  templateUrl: './item-session.component.html',
  styleUrls: ['./item-session.component.scss']
})
export class ItemSessionComponent implements OnInit {

  days: Session[] = [];
  // Holds the positions of the blanks in the day
  actualPositions:number[] = []

  constructor(
    private dialogRef: MatDialogRef<ItemSessionComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      day:any;
      item:any;
      dayTitle:string;
      tableTitle:string;
    },
    private weeklyS: WeeklyTableService
  ) {
    this.getBlanks(this.data.day.sessions)
  }

  getBlanks(day:any) {
    for (let i = 0; i < day.length; i++) {
      if (day[i].category == "Blank") {
        this.days.push(day[i])
        this.actualPositions.push(i)
      }
    }
  }

  open(i:number) {
    let p = this.actualPositions[i];
    this.data.day.sessions[p].title = this.data.item.title
    this.weeklyS.openSessionDialog(this.data.day.sessions, this.data.dayTitle, p, this.data.tableTitle)
  }

  ngOnInit(): void {
  }

}
