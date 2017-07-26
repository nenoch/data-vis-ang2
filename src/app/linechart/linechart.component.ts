import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DataService } from '../shared/data.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { ChartUtilsService } from '../shared/chart-utils.service';
import { ISubscription } from 'rxjs/Subscription';
import * as d3 from 'd3';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit, OnDestroy {
  @ViewChild('linechart') private lineContainer: ElementRef;
  private data;
  private xAxis;
  private yAxis;
  private margin = {top: 50, right: 20, bottom: 100, left: 45};
  private width: number;
  private height: number;
  private aspectRatio = 0.7;
  private lineColour: String = '#0056b8';
  private subscription: ISubscription;
  private animate: Boolean = true;

  @HostListener('window:resize', ['$event'])
  onKeyUp(ev: UIEvent) {
    if (this.dataExists()) {
        this.createLinechart();
      }
  }

  constructor(private dataService: DataService, private chartUtils: ChartUtilsService) {}

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private getData() {
    this.subscription = this.dataService.dataStream.subscribe((data) => {
      this.data = data;
      if (this.dataExists()) {
        this.setAxes();
        this.createLinechart(this.animate);
      }
    });
  }

  private dataExists() {
    return this.data.length !== 0;
  }

  private setAxes() {
    const axes = [];
    for (const k in this.data[0]) {
      if (this.data[0].hasOwnProperty(k)) {
        axes.push(k)
      }
    }
    this.xAxis = axes[0];
    this.yAxis = axes[1];
  }

  private setSize() {
    const container = this.lineContainer.nativeElement;
    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.aspectRatio * this.width - this.margin.top - this.margin.bottom;
  }


  private createLinechart(animate: Boolean = false) {
    console.log("creating chart");
    this.resetLinechart();
    if (this.chartUtils.checkYAxisError(this.data, this.yAxis)) { return }; // Return if yaxis is a string
    this.setSize();

    const element = this.lineContainer.nativeElement;

    // Set the range
    const x = d3.scaleBand()
              .rangeRound([0, this.width])
              .padding(1);
    const y = d3.scaleLinear()
              .rangeRound([this.height, 0]);

    const line = d3.line()
      .x(d => x(d[this.xAxis]))
      .y(d => this.setLineY(d, y));

    const svg = d3.select(element).append('svg')
        .attr('id', 'chart')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform',
              'translate(' + this.margin.left + ',' + this.margin.top + ')');

      // Scale the range of the data in the domains
      x.domain(this.data.map(d => d[this.xAxis]));
      y.domain(d3.extent(this.data, d => d[this.yAxis]));

      // X Axis
      svg.append('g')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(d3.axisBottom(x))
          .selectAll('text')
              .style('text-anchor', 'end')
              .attr('dx', '-.8em')
              .attr('dy', '.15em')
              .attr('transform', 'rotate(-65)' );

      // X Axis label
      svg.select('g')
          .append('text')
            .attr('class', 'label-style')
            .attr("x", this.width)
            .attr("y", -6)
            .style("text-anchor", "end")
            .text(this.xAxis);

      // Y Axis
      svg.append('g')
          .call(d3.axisLeft(y))
        .append('text')
          .attr('class', 'label-style')
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(this.yAxis);

      this.drawLine(svg, line, animate);
  }

  private drawLine(svg, line, animate: Boolean) {
    const path = svg.append('path')
          .datum(this.data)
          .attr('fill', 'none')
          .attr('stroke', this.lineColour)
          .attr('stroke-linejoin', 'round')
          .attr('stroke-linecap', 'round')
          .attr('stroke-width', 3)
          .attr('d', line);

    if (animate) {
      const totalLength = path.node().getTotalLength();
      path
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(2000)
        .attr('stroke-dashoffset', 0);
    }
  }

  private setLineY(d, y) {
      return y(d[this.yAxis]);
  }

  private resetLinechart() {
    this.chartUtils.resetSVG();
  }
}
