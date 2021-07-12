import { Item } from './../item';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { SessionService } from '../session.service';
@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  item:any;

  constructor(
    private dialogRef: MatDialogRef<EditItemComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      title:string,
      description: string,
      i: number,
      table: string
    },
    private sessionServ: SessionService
  ) {
    this.item = new Item(this.data.title, this.data.description)
  }

  ngOnInit(): void {}


  close() {
    this.sessionServ.updateItem(this.item, this.data.i, this.data.table)
    this.dialogRef.close(this.item)
  }
}
