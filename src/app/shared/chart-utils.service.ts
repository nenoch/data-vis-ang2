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

  public resetLegend() {
    const legend = d3.select('div#legend');
    legend.remove();
  }

  public checkAxisError(data, column, axis) {
    const error = { title: ` ${axis} Axis Error`, content: `Please enter a numeric value for the ${axis} Axis. Make sure it is unique.`};
    let flag = false;
    data.forEach(d => {
      if (isNaN(d[column])) {
        this.errorService.handleError(error);
        flag = true;
      }
    });
    return flag;
  }

  public checkZKeyError(data, zKey) {
    const error = { title: 'Input Error on Y field', content: 'Please enter a string value to generate stack or group barchart.'};
    let flag = false;
    data.forEach(d => {
      if (!isNaN(d[zKey])) {
        this.errorService.handleError(error);
        flag = true;
      }
    });
    return flag;
  }

  public checkRadiusError(data, radius) {
    let error = { title: 'R Error', content: 'Please enter a numeric value for the radius.'};
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
