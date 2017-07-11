import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ConverterService {

  constructor(private http: Http) { }

  convertFiles(){
    
    return this.http.get('/converter/convert')
      .map(res => res.json());

  }

}
