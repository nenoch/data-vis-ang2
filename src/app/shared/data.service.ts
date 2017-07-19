import { Injectable } from '@angular/core';
import { Constants } from './constant';
import { Http, Response } from '@angular/http';
import { AxisData } from '../graph-form/axis-data';
import 'rxjs/Rx';
import { Observable, BehaviorSubject } from 'rxjs';
import * as d3 from 'd3';


@Injectable()
export class DataService {

  public d3Data = [];
  public axes: AxisData;
  public dataStream: Observable<any>;
  private observable: BehaviorSubject<any>;

  constructor(private http: Http) {
    this.observable = new BehaviorSubject([]);
    this.dataStream = this.observable.asObservable();
  }

  // Independent from d3 library
  public getCSVColumns() {
    return this.http.get(Constants.CSV_DIR)
    .map((response: Response) => this.extractColumns(response));
  }

  public getCSV() {
    return this.http.get(Constants.CSV_DIR)
      .map(res => d3.csvParse(res['_body']));
  }

  public setAxes(axisObject) {
    this.axes = axisObject;
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
    d3.csv(Constants.CSV_DIR, function(d){
      const axisData = this.axes;
      return {
        [axisData.xColumn] : this.isNumber(d[axisData.xColumn]),
        [axisData.yColumn] : this.isNumber(d[axisData.yColumn])
      };
    }.bind(this), function(data) {
      this.setD3data(data);
    }.bind(this));
  }

  private isNumber(item) {
    if (item == +item) {
      return +item;
    } else {
      return item;
    }
  }

}
