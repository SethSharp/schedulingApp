import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DayTableComponent } from './day-table/day-table.component';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';
import { SideMenuContentComponent } from './side-menu-content/side-menu-content.component';
import { ViewSessionComponent } from './view-session/view-session.component';
import { MaterialModule } from './material.module';
@NgModule({
  declarations: [
    DayTableComponent,
    SessionDialogComponent,
    ViewSessionComponent,
    SideMenuContentComponent,
  ],
  exports: [
    DayTableComponent,
    SessionDialogComponent,
    ViewSessionComponent,
    SideMenuContentComponent,
  ],
  imports: [CommonModule, FormsModule, MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentModule {}
