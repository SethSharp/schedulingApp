import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DayTableComponent } from './day-table/day-table.component';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';
import { SideMenuContentComponent } from './side-menu-content/side-menu-content.component';
import { ViewSessionComponent } from './view-session/view-session.component';
import { MaterialModule } from './material.module';
import { GetTimetableComponent } from './get-timetable/get-timetable.component';
@NgModule({
  declarations: [
    DayTableComponent,
    SessionDialogComponent,
    ViewSessionComponent,
    SideMenuContentComponent,
    GetTimetableComponent
  ],
  exports: [
    DayTableComponent,
    SessionDialogComponent,
    ViewSessionComponent,
    SideMenuContentComponent,
    GetTimetableComponent
  ],
  imports: [CommonModule, FormsModule, MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentModule {}
