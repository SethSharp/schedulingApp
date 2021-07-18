import { EditItemComponent } from './../edit-item/edit-item.component';
import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { SessionService } from '../session.service';
import { Item } from "../item"
import { GeneralFunctionsService } from '../Services/general-functions.service';
import { ItemSessionComponent } from '../item-session/item-session.component';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss'],
})
export class ToDoListComponent implements OnInit {
  items: Item[] = [];
  completedItems: Item[] = [];
  toDelete: number[] = [];
  editTitle: any;
  editDescription: any;
  selectedDay:any;
  days = this.gServ.dayTitles
  pos:number = 0;

  constructor(
    private dialogRef: MatDialogRef<ToDoListComponent>,
    @Inject(MAT_DIALOG_DATA)
    private data: {
      tableContent: any;
      table: string;
    },
    private sessionServ: SessionService,
    private dialog: MatDialog,
    private gServ: GeneralFunctionsService
  ) {
    this.pos = new Date().getDay()-1
    if (this.pos == -1) this.pos = 6
    this.selectedDay = this.days[this.pos]
  }

  ngOnInit(): void {
    this.openToDoList(this.selectedDay);
  }

  ngOnDestroy(): void {
    for (let i = this.toDelete.length - 1; i >= 0; i--) {
      let d = this.toDelete[i];
      this.items.splice(d, 1);
    }
  }

  openToDoList(t:string) {
    // Basically just sets up the day if they have not been created yet
    // Each day for the list is loaded only when the user clicks on that day
    this.sessionServ.listExists(t).subscribe((b) => {
      if (!b) {
        this.sessionServ.createList(t).subscribe((l) => {
          this.createItems(l)
        })
      } else {
        this.sessionServ.retrieveList(t).subscribe((d) => {
          this.createItems(d)
        })
      }
    });
  }

  createItems(list:any) {
    this.items = []
    this.completedItems = [];
    this.pushItems(list.completed, this.items)
    this.pushItems(list.inCompleted, this.completedItems)
  }

  pushItems = (items:any, i:any) => {
    for (let item of items) {
      i.push(new Item(item.title, item.description))
    }
  }

  addItem() {
    let newItem = new Item(this.editTitle, this.editDescription);
    this.sessionServ.addItem(newItem, this.selectedDay).subscribe((d) => {
      this.items.push(newItem);
      this.editTitle = ""
      this.editDescription = ""
    });
  }

  editItem(item: any, i: number) {
    const dialogRef = this.gServ.openEditItemDialog(
      item.getTitle(),
      item.getDesc(),
      ['Title...', 'Description'],
      'Edit item',
    );

    dialogRef.afterClosed().subscribe((d) => {
      if (d==null) return
      let n = new Item(d.a, d.b);
      this.items[i] = n
      this.sessionServ.updateItem(n, i, this.selectedDay).subscribe(()=>{})
    });
  }

  completeItem(i: number) {
    // REMOVE FROM INCOMPLETE => COMPLETE
    // Save new list, or can splice in service, shall try
    this.sessionServ.completeItem(i, this.selectedDay).subscribe((l) => {
      // Don't need to create a new list just remove and it will be the same
      let n = this.items[i]
      this.items.splice(i,1)
      this.completedItems.push(n)
    });
  }

  moveItem(i:number) {
    this.sessionServ.moveItem(i, this.selectedDay).subscribe((d) => {
      this.items.push(this.completedItems[i])
      this.completedItems.splice(i,1)
    });
  }

  deleteItem(i:number) {
    this.sessionServ.deleteItem(i, this.selectedDay).subscribe((d)=> {
      this.completedItems.splice(i,1)
    })
  }

  setDay(d:string, i:number) {
    this.selectedDay = d
    this.pos = i
    this.openToDoList(d);
  }

  close() {
    this.dialogRef.close();
  }

  insertSession(i:number) {
    let d = this.data.tableContent[this.pos]
    this.dialog.open(ItemSessionComponent, {
      width: "30%",
      height: "50%",
      minHeight: "200px",
      minWidth: "250px",
      data: {
        day: d,
        item: this.items[i],
        dayTitle: this.selectedDay,
      tableTitle: this.data.table
      }
    })
  }

  moveSession(i:number) {4
    // Dont always move to tomorrow the day before
    // Need to find the day its on
    let pos = this.findDayInList(this.selectedDay)
    // Then find the next day
    let tomorrow = this.days[pos+1]
    if (pos == this.days.length-1) { // End of the week
      tomorrow = this.days[0]
    }
    this.sessionServ.addItem(this.items[i], tomorrow).subscribe(d=> {
      this.sessionServ.deleteItem(i, this.selectedDay).subscribe(t=> {
        this.items.splice(i,1)
      })
    })
  }

  findDayInList(day:string) {
    for (let i = 0; i < this.days.length; i++) {
      if (this.days[i] == day) return i
    }
    return 0
  }
}
