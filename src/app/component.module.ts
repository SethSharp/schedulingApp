import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DayTableComponent } from './day-table/day-table.component';
import { SessionDialogComponent } from './session-dialog/session-dialog.component';
import { CustomDayBlockComponent } from './custom-day-block/custom-day-block.component';
import { MaterialModule } from './material.module';
@NgModule({
  declarations: [
    DayTableComponent,
    SessionDialogComponent,
    CustomDayBlockComponent,
  ],
  exports: [DayTableComponent, SessionDialogComponent, CustomDayBlockComponent],
  imports: [CommonModule, FormsModule, MaterialModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentModule {}
