import { TestBed, inject } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { async } from '@angular/core/testing';

import { AxisData } from '../graph-form/axis-data';
import { DataFilter } from '../data-preview/data-filter';
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

  it('#getCSVColumns() should return columns', async(() => {
    service.url = 'assets/data/test-data.csv';
    service.getCSVColumns().subscribe(res => {
      expect(res).toEqual(['Country', 'Population (mill)', 'Life Expectancy', 'Area (1000 sq mi)']);
    });
  }));

  it('#getCSV() should return unfiltered response', async(() => {
    service.url = 'assets/data/test-data.csv';
    let data1 = {
        "Country": "Canada",
        "Population (mill)": '33.9',
        "Life Expectancy": '80.7',
        "Area (1000 sq mi)": '3854.085'
      };

    let data2 = {
        "Country": "Germany",
        "Population (mill)": '82.3',
        "Life Expectancy": '79.4',
        "Area (1000 sq mi)": '137.847'
      };
    service.getCSV().subscribe(res => {
      expect(res).toContain(data1);
      expect(res).toContain(data2);
    })
  })
  );

  it('#getCSV(filter) should return filtered response', async(() => {
    service.url = 'assets/data/test-data.csv';
    let data1 = {
        "Country": "Canada",
        "Population (mill)": '33.9',
        "Life Expectancy": '80.7',
        "Area (1000 sq mi)": '3854.085'
      };

    let data2 = {
        "Country": "Germany",
        "Population (mill)": '82.3',
        "Life Expectancy": '79.4',
        "Area (1000 sq mi)": '137.847'
      };

    let filter = new DataFilter('Country','Can');
    service.getCSV(filter).subscribe(res => {
      expect(res).toContain(data1);
      expect(res).not.toContain(data2);
    })
  })
  );

  it('#setAxes() should set the axes', () => {
    let axesObj = new AxisData('Country', 'Life Expectancy');
    service.url = 'assets/data/test-data.csv';
    spyOn(service, 'convertD3data');
    service.setAxes(axesObj, 'barchart');
    expect(service.axes).toEqual(axesObj);
    expect(service.convertD3data).toHaveBeenCalled();
  });

  it('#setAxes() should call sendD3Data() if graphType === linechart || scatterchart', () => {
    let axesObj = new AxisData('Country', 'Life Expectancy');
    service.url = 'assets/data/test-data.csv';
    spyOn(service, 'sendD3Data');
    service.setAxes(axesObj, 'linechart');
    expect(service.sendD3Data).toHaveBeenCalled();
    service.setAxes(axesObj, 'scatterchart');
    expect(service.sendD3Data).toHaveBeenCalled();
  });

  it('#setD3data() should return data to observable', async(() => {
    let data = [{
        "Country": "Canada",
        "Population (mill)": '33.9',
        "Life Expectancy": '80.7',
        "Area (1000 sq mi)": '3854.085'
      },{
          "Country": "Germany",
          "Population (mill)": '82.3',
          "Life Expectancy": '79.4',
          "Area (1000 sq mi)": '137.847'
        }];
    service.setD3data(data);
    service.dataStream.subscribe(res => {
      expect(res).toEqual(data);
    })
  })
  );


});
