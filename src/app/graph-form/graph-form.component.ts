import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AxisData } from './axis-data';
import { DataService } from '../data.service';
import { ChartUtilsService } from '../chart-utils.service';
import { GraphService } from '../graph-area/graph.service';

@Component({
  selector: 'app-graph-form',
  templateUrl: './graph-form.component.html',
  styleUrls: ['./graph-form.component.css']
})
export class GraphFormComponent implements OnInit {

  private axisData: AxisData;

  constructor(private dataService: DataService, private chartUtils: ChartUtilsService, private graphService: GraphService) {}

  ngOnInit() {
    this.axisData = new AxisData('', '');
  }

  private selectGraph(graph) {
    this.graphService.setGraph(graph);
  }

  private transferDataSuccess(event) {
    const axis = event.mouseEvent.target.name
    this.axisData[`${axis}Column`] = event.dragData;
  }

  private onSubmit(form: NgForm) {
    this.dataService.setAxes(this.axisData);
    this.selectGraph('default');
  }

  private onReset() {
    this.chartUtils.resetSVG();
  }
}
