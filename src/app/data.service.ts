import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { AxisData } from './graph-form/axis-data';
import 'rxjs/Rx';
import { Observable } from 'rxjs';
import * as d3 from 'd3';


@Injectable()
export class DataService {

  private csvPath = 'assets/mock-data/data.csv';
  public d3Data = [];
  public axes: AxisData;

  constructor(private http: Http){
  }

  // Independent from d3 library
  getCSVColumns() {
    return this.http.get(this.csvPath)
    .map((response: Response) => this.extractColumns(response));
  }

  setAxes(axisObject){
    this.axes = axisObject;
    this.convertD3data();
  }

  private extractColumns(response: Response){
    let csvData = response['_body'];
    let valuePairs = csvData.split(/\r\n|\n/);
    let columns = valuePairs[0].split(',');
    return columns;
  }
  //

  private setD3data(data){
    this.d3Data = data;
    console.log(this.d3Data);
  }

  private convertD3data(){
    d3.csv(this.csvPath, function(d){
      let axisData = this.axes;
      return {
        [axisData.xColumn] : d[axisData.xColumn],
        [axisData.yColumn] : d[axisData.yColumn]
      };
    }.bind(this), function(data) {
      this.setD3data(data);
      // the last object in the data array holds the columns;
    }.bind(this));
  }

}
