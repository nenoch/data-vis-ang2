import { TestBed, inject } from '@angular/core/testing';

import { ChartUtilsService } from './chart-utils.service';

xdescribe('ChartUtilsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ChartUtilsService]
    });
  });

  it('should be created', inject([ChartUtilsService], (service: ChartUtilsService) => {
    expect(service).toBeTruthy();
  }));
});
