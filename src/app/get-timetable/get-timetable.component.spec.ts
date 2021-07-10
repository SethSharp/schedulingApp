import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetTimetableComponent } from './get-timetable.component';

describe('GetTimetableComponent', () => {
  let component: GetTimetableComponent;
  let fixture: ComponentFixture<GetTimetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetTimetableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetTimetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
