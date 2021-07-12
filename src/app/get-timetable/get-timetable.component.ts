import { GeneralFunctionsService } from './../Services/general-functions.service';
import { Component, OnInit, Inject } from '@angular/core';
import { SessionService } from '../session.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-get-timetable',
  templateUrl: './get-timetable.component.html',
  styleUrls: ['./get-timetable.component.scss'],
})
export class GetTimetableComponent implements OnInit {
  constructor(
    private sessionServ: SessionService,
    private dRef: MatDialogRef<GetTimetableComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      tables: any;
    },
    private gServ: GeneralFunctionsService
  ) {
    this.tables = this.data.tables;
  }

  table = '';
  tables: any;

  ngOnInit(): void {}

  submitTable(t: string = this.table) {
    if (t.length > 0) {
      this.dRef.close(t);
    } else {
      this.gServ.openSnack("Enter a valid title...")
    }
  }

  deleteTable(t: string, i: number) {
    if (t == 'Main') {
      this.gServ.openSnack("Cannot delete the main timetable...")
      return
    }
    this.sessionServ.deleteTable(t).subscribe((d) => {
      if (d) {
        this.tables.splice(i, 1);
      } else {
        this.gServ.openSnack("Could not delete")
      }
    });
  }
}
