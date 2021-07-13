import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { GeneralFunctionsService } from '../Services/general-functions.service';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  categories:any;

  constructor(private gServ: GeneralFunctionsService, private sessionServ: SessionService) { }

  ngOnInit(): void {
    this.sessionServ.getCategories().subscribe((c) => {
      this.categories = c
    })
  }

  editCategory(category:any) {
    // Edit cat in DB
    // Change cats in the all tables... maybe not know, quite a lot
    const dialogRef = this.gServ.openEditItemDialog(
      category.title,
      category.colour,
      ["Title...", "Colour..."],
      "Edit category"
    )
    dialogRef.afterClosed().subscribe((d) => {
      try {
        this.sessionServ.editCategory(category, { title: d.a, colour: d.b }).subscribe(()=> {})
      } catch {
      }
    })
  }

  deleteCategory(c:any,i:number) {
    this.sessionServ.deleteCategory(c.title).subscribe((d) => {
      this.categories.splice(i,1)
    });

  }
}
