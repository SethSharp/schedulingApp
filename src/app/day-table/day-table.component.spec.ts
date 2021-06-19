import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayTableComponent } from './day-table.component';

describe('DayTableComponent', () => {
  let component: DayTableComponent;
  let fixture: ComponentFixture<DayTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DayTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DayTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
