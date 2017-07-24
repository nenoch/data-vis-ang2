import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import { DataService } from '../shared/data.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { ChartUtilsService } from '../shared/chart-utils.service';
import { ISubscription } from 'rxjs/Subscription';

import * as d3 from 'd3';

@Component({
  selector: 'app-scatterchart',
  templateUrl: './scatterchart.component.html',
  styleUrls: ['./scatterchart.component.css']
})

export class ScatterchartComponent implements OnInit {
  @ViewChild('scatterchart') private scatterContainer: ElementRef;
  private data;
  private xAxis;
  private yAxis;
  private radius;
  private margin = {top: 50, right: 20, bottom: 100, left: 45};
  private width: number;
  private height: number;
  private aspectRatio = 0.7;
  private circleColour: String = '#0056b8';
  private subscription: ISubscription;
  private animate: Boolean = true;

  @HostListener('window:resize', ['$event'])
  onKeyUp(ev: UIEvent) {
    if (this.dataExists()) {
        this.createScatterchart();
      }
  }

  constructor(private dataService: DataService, private errorService: ErrorHandlerService, private chartUtils: ChartUtilsService) {}

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
        this.createScatterchart();
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
    this.radius = axes[2];
  }


  private setSize() {
    const container = this.scatterContainer.nativeElement;
    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.aspectRatio * this.width - this.margin.top - this.margin.bottom;
  }

  private createScatterchart() {
    this.resetScatterchart();
    this.setSize();

    const element = this.scatterContainer.nativeElement;

    const xScale = d3.scaleLinear()
                  .range([0, this.width])
                  .domain(d3.extent(this.data, d => d[this.xAxis]));

    const yScale = d3.scaleLinear()
                  .range([this.height, 0])
                  .domain(d3.extent(this.data, d => d[this.yAxis] ));

    const rScale = d3.scaleSqrt()
                  .domain([0, d3.max(this.data, d => d[this.radius])])
                  .range([0,30]);

    const svg = d3.select(element).append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform',
              'translate(' + this.margin.left + ',' + this.margin.top + ')');

      // X Axis
      svg.append('g')
          .attr('transform', 'translate(0,' + this.height + ')')
          .call(d3.axisBottom(xScale))
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
          .call(d3.axisLeft(yScale))
        .append('text')
          .attr('class', 'label-style')
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(this.yAxis);

      var circles = svg.selectAll('.circle')
                        .data(this.data)
                        .enter()
                        .append('g')
                        .attr('class', 'circle')
                        .attr('transform', d => {
                          return `translate(${xScale(d[this.xAxis])}, ${yScale(d[this.yAxis])})`
                        });

      circles.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', d => this.setCircleRadius(rScale,d))
        .style('fill', this.circleColour);

      if (this.radius !== '') {

        circles.append('text')
          .attr('text-anchor', 'middle')
          .attr('class', 'circle-tip')
          .text(d => `${this.radius}: ${d[this.radius]}`);

      }

  }

  private setCircleRadius(rScale,d) {
    if (this.radius !== '') {
      return rScale(d[this.radius]);
    } else {
      return 4;
    }
  }

  private resetScatterchart() {
    this.chartUtils.resetSVG();
  }

}
