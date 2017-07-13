import { TestBed, inject } from '@angular/core/testing';

import { ChartUtilsService } from './chart-utils.service';

describe('ChartUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartUtilsService]
    });
  });

  it('should be created', inject([ChartUtilsService], (service: ChartUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
