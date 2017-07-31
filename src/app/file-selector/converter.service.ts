import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';


@Injectable()
export class ConverterService {

  constructor(private http: Http) { }

public convertFiles() {

    return this.http.get('/api/convert')
      .map(res => res.json());

  }

}
