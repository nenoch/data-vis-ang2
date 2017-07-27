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

  public checkYAxisError(data, yAxis) {
    const error = { title: 'Y Axis Error', content: 'Please enter a numeric value for the Y Axis.'};
    let flag = false;
    data.forEach(d => {
      if (isNaN(d[yAxis])) {
        this.errorService.handleError(error);
        flag = true;
      }
    });
    return flag;
  }

  public checkRadiusError(data, radius) {
    let error = { title: 'R Error', content: 'Please enter a numeric value that hasn\'t been assigned to X or Y for the radius.'};
    let flag = false;
    if (radius !== '' && !this.isNumber(data[0][radius])) {
        this.errorService.handleError(error);
        flag = true;
    }
    return flag;
   }

  private isNumber(item) {
    if (item == +item) {
      return true;
    } else {
      return false;
    }
  }

}
