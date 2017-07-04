import { Injectable } from '@angular/core';
import { DATA } from './mock-data/mock';

@Injectable()
export class DataService {

  constructor() {}

  getData() {
    return DATA;
  }

}
