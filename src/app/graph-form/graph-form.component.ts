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
  graphType: String = Constants.DEFAULT_GRAPH;

  public barFocusTrigger = new EventEmitter<boolean>();
  public lineFocusTrigger = new EventEmitter<boolean>();
  public scatterFocusTrigger = new EventEmitter<boolean>();
  private axisData: AxisData;

  constructor(private dataService: DataService, private chartUtils: ChartUtilsService) {}

  ngOnInit() {
    this.axisData = new AxisData('', '', '');
  }

  private transferDataSuccess(event) {
    const axis = event.mouseEvent.target.name
    this.axisData[`${axis}Column`] = event.dragData;
  }

  private onSubmit(form: NgForm) {
    if (!this.axisData.xColumn || !this.axisData.yColumn) {
      return;
    }
    this.dataService.setAxes(this.axisData);
    this.toggleChartBtn();
  }

  private toggleChartBtn(){
    if (this.graphType === 'linechart'){
      this.lineFocusTrigger.emit(true);
    } else if (this.graphType === 'barchart'){
      this.barFocusTrigger.emit(true);
    } else if (this.graphType === 'scatterchart'){
      this.scatterFocusTrigger.emit(true);
    }
  }

  private changeGraph(graph) {
    this.graphType = graph;
  }

  private onReset() {
    this.chartUtils.resetSVG();
    this.dataService.setD3data([]);
  }
}
