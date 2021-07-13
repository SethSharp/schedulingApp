import { Component, OnInit, Input } from '@angular/core';
import { WeeklyTableService } from '../weekly-table.service';

@Component({
  selector: 'app-week-table',
  templateUrl: './week-table.component.html',
  styleUrls: ['./week-table.component.scss'],
})
export class WeekTableComponent implements OnInit {
  constructor(private weeklyS: WeeklyTableService) {}

  times = this.weeklyS.times;
  headerContent = this.weeklyS.headerContent;
  @Input() table: any;
  @Input() days: any;
  getAmount = this.weeklyS.getAmount;
  getHeight = this.weeklyS.getHeight;
  viewEditSession = this.weeklyS.viewEditSession;
  openSessionDialog = this.weeklyS.openSessionDialog;

  ngOnInit(): void {}
}
