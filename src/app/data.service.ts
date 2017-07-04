import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs';

@Injectable()
export class DataService {

  constructor(private http: Http){}

  getCSVColumns() {
    return this.http.get('assets/mock-data/data.csv')
      .map((response: Response) => this.extractColumns(response));
  }

  private extractColumns(response: Response){
    let csvData = response['_body'];
    let valuePairs = csvData.split(/\r\n|\n/);
    let columns = valuePairs[0].split(',');
    return columns;
  }

/* Note in use

  getData() {
  return this.http.get('assets/mock-data/data.csv')
    .map((response: Response) => this.extractData(response));
  }

  private extractData(response: Response){
    let csvData = response['_body'];
    return csvData;
  }
*/

}
