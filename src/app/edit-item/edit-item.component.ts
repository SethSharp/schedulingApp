import { Item } from './../item';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SessionService } from '../Services/Session/session.service';
@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  item:any;
  a:any;
  b:any;
  info = ['',''];
  title = '';
  color="red"
  pos="top-right"
  constructor(
    private dialogRef: MatDialogRef<EditItemComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      a:any,
      b: any,
      info: any,
      title: string
    }
  ) {
    this.title = this.data.title
    this.info[0] = this.data.info[0]
    this.info[1] = this.data.info[1]
    this.a = this.data.a
    this.b = this.data.b
    this.color = this.b
  }

  ngOnInit(): void {

  }


  close() {
    if (this.title=='Edit item') {
      this.dialogRef.close({a:this.a, b:this.b})
    } else {
      this.dialogRef.close({ a: this.a, b: this.color });
    }
  }
}
