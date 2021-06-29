import { GeneralFunctionsService } from './../Services/general-functions.service';
import { Component, OnInit, Input} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-view-session',
  templateUrl: './view-session.component.html',
  styleUrls: ['./view-session.component.scss'],
})
export class ViewSessionComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<ViewSessionComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      session: any;
    },
    private gService: GeneralFunctionsService
  ) {
    this.getEndTime();
  }

  x=''
  y=''

  getEndTime() {
    let start = new Date()
    let end = new Date()
    start.setHours(this.data.session.start)
    let sMinutes = this.gService.convertDecimalPxToTime(
      this.data.session.start
    );
    start.setMinutes(sMinutes);
    start.setSeconds(0)

    let tMinutes = this.gService.convertPxToTime(this.data.session.len);
    end.setHours(start.getHours())
    end.setMinutes(tMinutes+start.getMinutes())
    end.setSeconds(0)

    this.x = start.toLocaleTimeString()
    this.x = this.x.substring(0,4) + this.x.substring(7, this.x.length)
    this.y = end.toLocaleTimeString();
    this.y = this.y.substring(0, 4) + this.y.substring(7, this.y.length);
  }

  ngOnInit(): void {}
}
