import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DayTableComponent } from './day-table/day-table.component';

@NgModule({
  declarations: [DayTableComponent],
  exports: [DayTableComponent],
  imports: [CommonModule],
})
export class ComponentModule {}
