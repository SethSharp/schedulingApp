import { TestBed } from '@angular/core/testing';

import { WeeklyTableService } from './weekly-table.service';

describe('WeeklyTableService', () => {
  let service: WeeklyTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeeklyTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
