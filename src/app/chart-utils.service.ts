import { Injectable, EventEmitter } from '@angular/core';
import * as d3 from 'd3';


@Injectable()
export class ChartUtilsService {

  constructor() { }

  resetSVG(){
    let svg = d3.select('svg');
    svg.remove();
  }

}
