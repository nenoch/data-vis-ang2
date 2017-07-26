import { Injectable, EventEmitter } from '@angular/core';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import * as d3 from 'd3';


@Injectable()
export class ChartUtilsService {

  constructor(private errorService: ErrorHandlerService) { }

  public resetSVG(){
    let svg = d3.select('svg');
    svg.remove();
  }

  public checkRadiusError(data, radius) {
    let error = { title: 'R Error', content: 'Please enter a numeric value that hasn\'t been assigned to X or Y for the radius.'};
    let flag = false;

    if (!this.isNumber(data[0][radius])) {
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
