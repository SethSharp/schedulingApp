import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DayTableComponent } from './day-table/day-table.component';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';
import { SideMenuContentComponent } from './side-menu-content/side-menu-content.component';
import { ViewSessionComponent } from './view-session/view-session.component';
import { MaterialModule } from './material.module';
import { GetTimetableComponent } from './get-timetable/get-timetable.component';
import { ToDoListComponent } from './to-do-list/to-do-list.component';
import { EditItemComponent } from './edit-item/edit-item.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [
    DayTableComponent,
    SessionDialogComponent,
    ViewSessionComponent,
    SideMenuContentComponent,
    GetTimetableComponent,
    ToDoListComponent,
    EditItemComponent,
    SettingsComponent,
  ],
  exports: [
    DayTableComponent,
    SessionDialogComponent,
    ViewSessionComponent,
    SideMenuContentComponent,
    GetTimetableComponent,
    ToDoListComponent,
    EditItemComponent,
    SettingsComponent,
  ],
  imports: [CommonModule, FormsModule, MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentModule {}
