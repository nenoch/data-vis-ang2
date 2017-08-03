import { Injectable } from '@angular/core';
import { Constants } from './constant';
import { Http, Response } from '@angular/http';
import { AxisData } from '../graph-form/axis-data';
import { DataFilter } from '../data-preview/data-filter';
import 'rxjs/Rx';
import { Observable, BehaviorSubject } from 'rxjs';
import * as d3 from 'd3';


@Injectable()
export class DataService {

  public d3Data = [];
  public axes: AxisData;
  public dataStream: Observable<any>;
  private observable: BehaviorSubject<any>;
  private url = Constants.CSV_DIR;

  constructor(private http: Http) {
    this.observable = new BehaviorSubject([]);
    this.dataStream = this.observable.asObservable();
  }

  // Independent from d3 library
  public getCSVColumns() {
    return this.http.get(this.url)
    .map((response: Response) => this.extractColumns(response));
  }

  // Once connected to backend, change this so it gets the filtered csv from the backend and passes that to data-table
  public getCSV(filter) {
    return this.http.get(this.url)
      .map(res => this.prepareCSVResponse(res, filter));
  }

  public setAxes(axisObject, graphType) {
    this.axes = axisObject;
    if (graphType === ('linechart' || 'scatterchart')) {
      this.sendD3Data();
      return;
    }
    this.convertD3data();
  }

  public setD3data(data) {
    this.observable.next(this.d3Data = data);
  }

  private extractColumns(response: Response) {
    const csvData = response['_body'];
    const valuePairs = csvData.split(/\r\n|\n/);
    const columns = valuePairs[0].split(',');
    return columns;
  }

  private convertD3data() {
    d3.csv(this.url, d => {
      const axisData = this.axes;
      return {
        [axisData.xColumn] : this.isNumber(d[axisData.xColumn]),
        [axisData.yColumn] : this.isNumber(d[axisData.yColumn]),
      };
    }, data => {
      data.axes = this.axes;
      this.setD3data(data);
    });
  }

  // Sends entire csv data in json format, currently used for linechart
  private sendD3Data() {
    d3.csv(this.url, d => {
      for (const key in d) {
        if (d.hasOwnProperty(key)) {
          d[key] = this.isNumber(d[key]);
        }
      }
      return d;
    }, data => {
      data.axes = this.axes;
      this.setD3data(data);
    })
  }

  private isNumber(item) {
    if (item == +item) {
      return +item;
    } else {
      return item;
    }
  }

  // -----TODO This is just in place untill we connect to the backend, remove after
  private prepareCSVResponse(res: Response, filter: DataFilter) {
    let data = d3.csvParse(res['_body']);
    if (!filter) {
      return data;
    }
    const columns = data.columns
    data = data.filter(item => this.arraryFilter(item, filter));
    data.columns = columns;
    return data;
  }

  private arraryFilter(item: object, filter: DataFilter) {
    console.log(item);
    return item[`${filter.column}`].toLowerCase().includes(filter.filterString.toLowerCase());
  }
// -----------
}
