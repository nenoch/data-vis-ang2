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

  @Input() zvalues;
  @Input() colours;


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

    let svg = d3.select(element).append('svg')
        .attr('id', 'legend')
        .attr("width", 300)
        .attr("height", 50)
        .append('g')
          .attr('transform',
                'translate(0,' + this.margin.top + ')');

    let legend = svg.selectAll(".legend-key")
              .data(this.zvalues)
              .enter().append("g")
              .attr("transform", (d, i) => `translate(0,${i*13})`);

    legend.append("text")
          .attr("x", 76)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .attr("class", "label-style")
          .text(function(d) { return d; });

    legend.append("rect")
        .attr("x", 100)
        .attr("width", 18)
        .attr("height", 5)
        .style("fill", (d, i) => this.colours(i));
  }

  private reset() {
    this.chartUtils.resetLegend();
  }

}
