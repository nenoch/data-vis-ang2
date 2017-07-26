import { Injectable, EventEmitter } from '@angular/core';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import * as d3 from 'd3';


@Injectable()
export class ChartUtilsService {

  constructor(private errorService: ErrorHandlerService) { }

  public resetSVG() {
    const svg = d3.select('svg');
    svg.remove();
  }

  public checkYAxis(data, yAxis) {
    const error = { title: 'Y Axis Error', content: 'Please enter a numeric value for the Y Axis.'};
    data.forEach(d => {
      if (isNaN(d[yAxis])) {
        this.errorService.handleError(error);
        return false;
      } else {
        return true;
      }
    });
  }

}
