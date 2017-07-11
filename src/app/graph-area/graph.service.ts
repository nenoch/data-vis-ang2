import { Injectable, EventEmitter } from '@angular/core';

import { Graph } from './graph';
import { BarchartComponent } from '../barchart/barchart.component';
import { LinechartComponent } from '../linechart/linechart.component';

@Injectable()
export class GraphService {
  public selectedGraph = new EventEmitter();

  private graphs = {
    default: BarchartComponent,
    barchart: BarchartComponent,
    linechart: LinechartComponent
  }

  constructor() { }

  public setGraph(graph) {
    this.selectedGraph.emit(new Graph(this.graphs[graph]))
  }
}
