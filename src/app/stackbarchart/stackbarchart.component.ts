import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import { DataService } from '../shared/data.service';
import { ChartUtilsService } from '../shared/chart-utils.service';
import { ISubscription } from 'rxjs/Subscription';

import * as d3 from 'd3';

@Component({
  selector: 'app-stackbarchart',
  templateUrl: './stackbarchart.component.html',
  styleUrls: ['./stackbarchart.component.css']
})
export class StackbarchartComponent implements OnInit, OnDestroy {
  @ViewChild('stackbarchart') private stackbarContainer: ElementRef;
  private data;
  private xAxis;
  // private yAxis;
  private zKey;
  private margin = {top: 50, right: 20, bottom: 100, left: 45};
  private width: number;
  private height: number;
  private aspectRatio = 0.7;
  private stackbarColours;
  private subscription: ISubscription;
  private animate: Boolean = true;

  constructor(private dataService: DataService, private chartUtils: ChartUtilsService) { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  private setSize() {
    const container = this.stackbarContainer.nativeElement;
    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.aspectRatio * this.width - this.margin.top - this.margin.bottom;
  }

  private createStackbarchart() {
    this.resetStackbarchart();
    // if (this.chartUtils.checkYAxisError(this.data, this.yAxis)) { return } // Return if yaxis is a string
    this.setSize();

    const element = this.stackbarContainer.nativeElement;

    this.stackbarColours = d3.scaleOrdinal(d3.schemeCategory20);
  // .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);



  }

  private resetStackbarchart() {
    this.chartUtils.resetSVG();
  }

}
