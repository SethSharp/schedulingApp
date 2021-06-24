import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDayBlockComponent } from './custom-day-block.component';

describe('CustomDayBlockComponent', () => {
  let component: CustomDayBlockComponent;
  let fixture: ComponentFixture<CustomDayBlockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDayBlockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDayBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
