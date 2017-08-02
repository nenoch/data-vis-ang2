import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input } from '@angular/core';
import { ChartUtilsService } from '../shared/chart-utils.service';

import * as d3 from 'd3';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  styleUrls: ['./legend.component.css']
})
export class LegendComponent implements OnInit, OnChanges {
  @ViewChild('legend') private legendContainer: ElementRef;
  private margin = {top: 10, right: 20, left: 20};
  private aspectRatio = 0.7;
  private width: number;
  private height: number;

  @Input() legendKeys: Array<any>;
  @Input() colours: any;


  constructor(private chartUtils: ChartUtilsService) {}

  ngOnChanges() {
    this.createLegend();
  }

  ngOnInit(){}

  private setSize() {
    const container = this.legendContainer.nativeElement;
    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.aspectRatio * this.width - this.margin.top;
  }

  private createLegend(){
    this.reset();
    this.setSize();
    let element = this.legendContainer.nativeElement;

    let div = d3.select(element).append('div')
        .attr('id', 'legend')
        .attr('class', 'margin-top10');

    let legend = div.selectAll('.legend-key')
              .data(this.legendKeys)
              .enter().append('div')
              .attr('class', 'legend-key')
              .append('p')
              .attr('class', 'label-style')
              .text(function(d) { return d; });

    legend.append('span')
        .attr('class', 'key-dot')
        .style('background-color', (d, i) => this.colours(i));
  }

  private reset() {
    this.chartUtils.resetLegend();
  }

}
