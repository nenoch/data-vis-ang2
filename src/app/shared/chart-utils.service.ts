import { Injectable, EventEmitter } from '@angular/core';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import * as d3 from 'd3';


@Injectable()
export class ChartUtilsService {

  constructor(private errorService: ErrorHandlerService) { }

  public resetSVG() {
    const chart = d3.select('svg#chart');
    chart.remove();
  }

  public checkAxisError(data, column, axis) {
    const error = { title: ` ${axis} Axis Error`, content: `Please enter a numeric value for the ${axis} Axis.`};
    let flag = false;
    data.forEach(d => {
      if (isNaN(d[column])) {
        this.errorService.handleError(error);
        flag = true;
      }
    });
    return flag;
  }
}
