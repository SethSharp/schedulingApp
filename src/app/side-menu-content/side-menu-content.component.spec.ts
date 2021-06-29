import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideMenuContentComponent } from './side-menu-content.component';

describe('SideMenuContentComponent', () => {
  let component: SideMenuContentComponent;
  let fixture: ComponentFixture<SideMenuContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SideMenuContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SideMenuContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
