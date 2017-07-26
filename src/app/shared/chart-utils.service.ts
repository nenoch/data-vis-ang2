import { Injectable, EventEmitter } from '@angular/core';
import * as d3 from 'd3';


@Injectable()
export class ChartUtilsService {

  constructor() { }

  resetSVG(){
    let chart = d3.select('svg#chart');
    chart.remove();
  }

}
