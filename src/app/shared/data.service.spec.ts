import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { DataService } from './data.service';

describe('DataService', () => {

  let service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [DataService]
    });
  });

  beforeEach(inject([DataService], s => {
  service = s;
  }));

  xit('should be created', inject([DataService], (service: DataService) => {
    expect(service).toBeTruthy();
  }));

  it('should convert item to Number if string is number', () => {
    expect(service.isNumber('9')).toEqual(9);
    expect(service.isNumber('nine')).toEqual('nine');
  });

});
