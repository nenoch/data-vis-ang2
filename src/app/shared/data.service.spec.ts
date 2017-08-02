import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { AxisData } from '../graph-form/axis-data';
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

  it('should return columns', async(() => {
    // add async
    service.url = 'assets/data/main-data.csv';
    service.getCSVColumns().subscribe(x => {
      expect(x).toContain('Country');
    });
  }));

  it('WIP should set the axes and generate data accordingly', () => {
    let axes1 = new AxisData('Country', 'Life Expectancy');
    service.url = 'assets/data/main-data.csv';
    service.setAxes(axes1, 'barchart')
    expect(service.axes).toEqual(axes1);
  });

  it('should convert item to Number if string is number', () => {
    expect(service.isNumber('9')).toEqual(9);
    expect(service.isNumber('nine')).toEqual('nine');
  });

});
