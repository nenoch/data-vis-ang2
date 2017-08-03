import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AxisData } from './axis-data';
import { DataService } from '../shared/data.service';
import { ChartUtilsService } from '../shared/chart-utils.service';
import { Constants } from '../shared/constant';


@Component({
  selector: 'app-graph-form',
  templateUrl: './graph-form.component.html',
  styleUrls: ['./graph-form.component.css']
})
export class GraphFormComponent implements OnInit {

  @Output()
  graphType: string = Constants.DEFAULT_GRAPH;

  private axisData: AxisData;

  constructor(private dataService: DataService, private chartUtils: ChartUtilsService) {}

  ngOnInit() {
    this.axisData = new AxisData('', '');
  }

  private transferDataSuccess(event) {
    const axis = event.mouseEvent.target.name
    this.axisData[`${axis}Column`] = event.dragData;
  }

  private onSubmit(form: NgForm) {
    if (!this.axisData.xColumn || !this.axisData.yColumn) {
      return;
    }
    if (this.graphType === 'default') {
      this.graphType = 'barchart';
    }
    this.dataService.setAxes(this.axisData, this.graphType);
  }

  private changeGraph(graph) {
    this.graphType = graph;
    if (this.axisData.isEmpty()) { return; }
    this.dataService.setAxes(this.axisData, this.graphType);
  }

  private onReset() {
    this.graphType = 'default';
    this.chartUtils.resetSVG();
    this.chartUtils.resetLegend();
    this.dataService.setD3data([]);
  }
}
