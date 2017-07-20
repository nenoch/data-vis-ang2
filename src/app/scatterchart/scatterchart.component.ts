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
  private data = [
 {
   "Category": "Technology",
   "TotalValue": 93910.21,
   "ProductConcentration": 0.030137063,
   "CustomerConcentration": 0.087770725
 },
 {
   "Category": "Technology",
   "TotalValue": 185853.87,
   "ProductConcentration": 0.727932545,
   "CustomerConcentration": 0.234178493
 },
 {
   "Category": "Office Supplies",
   "TotalValue": 47862.64,
   "ProductConcentration": 0.869843455,
   "CustomerConcentration": 0.967766883
 },
 {
   "Category": "Furniture",
   "TotalValue": 118352.55,
   "ProductConcentration": 0.185026777,
   "CustomerConcentration": 0.627607548
 },
 {
   "Category": "Office Supplies",
   "TotalValue": 9512.23,
   "ProductConcentration": 0.080804313,
   "CustomerConcentration": 0.914777644
 },
 {
   "Category": "Office Supplies",
   "TotalValue": 2074.76,
   "ProductConcentration": 0.303772145,
   "CustomerConcentration": 0.029366578
 },
 {
   "Category": "Furniture",
   "TotalValue": 224691.01,
   "ProductConcentration": 0.742161958,
   "CustomerConcentration": 0.886106234
 },
 {
   "Category": "Office Supplies",
   "TotalValue": 6940.06,
   "ProductConcentration": 0.06212297,
   "CustomerConcentration": 0.655249515
 },
 {
   "Category": "Office Supplies",
   "TotalValue": 89394.16,
   "ProductConcentration": 0.52971077,
   "CustomerConcentration": 0.439508931
 },
 {
   "Category": "Furniture",
   "TotalValue": 301858.94,
   "ProductConcentration": 0.318459499,
   "CustomerConcentration": 0.209223271
 },
 {
   "Category": "Technology",
   "TotalValue": 125443.68,
   "ProductConcentration": 0.565379441,
   "CustomerConcentration": 0.618075232
 },
 {
   "Category": "Office Supplies",
   "TotalValue": 20591.01,
   "ProductConcentration": 0.746932104,
   "CustomerConcentration": 0.232158633
 },
 {
   "Category": "Office Supplies",
   "TotalValue": 202564.78,
   "ProductConcentration": 0.665022485,
   "CustomerConcentration": 0.230177646
 },
 {
   "Category": "Technology",
   "TotalValue": 285491.32,
   "ProductConcentration": 0.554136398,
   "CustomerConcentration": 0.751528667
 },
 {
   "Category": "Furniture",
   "TotalValue": 78646.02,
   "ProductConcentration": 0.159382955,
   "CustomerConcentration": 0.775545349
 },
 {
   "Category": "Office Supplies",
   "TotalValue": 44425.64,
   "ProductConcentration": 0.324886509,
   "CustomerConcentration": 0.508537074
 },
 {
   "Category": "Office Supplies",
   "TotalValue": 173190.97,
   "ProductConcentration": 0.469404641,
   "CustomerConcentration": 0.035722445
 }
];

  private xAxis = "ProductConcentration";
  private yAxis = "CustomerConcentration";
  private radius = "TotalValue";
  private margin = {top: 50, right: 20, bottom: 100, left: 45};
  private width: number;
  private height: number;
  private aspectRatio = 0.7;
  private circleColour: String = '#0056b8';
  private subscription: ISubscription;
  private animate: Boolean = true;

  constructor(private dataService: DataService, private errorService: ErrorHandlerService, private chartUtils: ChartUtilsService) {}

  ngOnInit() {
    this.createScatterchart();
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
            .attr('x', 8)
            .attr('y', -this.width)
            .attr('dy', -6)
            .attr('transform', 'rotate(90)' )
            .attr('text-anchor', 'middle')
            .text(this.xAxis);

      // Y Axis
      svg.append('g')
          .call(d3.axisLeft(yScale))
        .append('text')
          .attr('class', 'label-style')
          .attr('y', -6)
          .attr('text-anchor', 'middle')
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
        .attr('r', d => rScale(d[this.radius]))
        .style('fill', this.circleColour);

    circles.append('text')
        .attr('text-anchor', 'middle')
        .attr('class', 'circle-tip')
        .text(d => `${this.radius}: ${d[this.radius]}`);

  }

  private resetScatterchart() {
    this.chartUtils.resetSVG();
  }

}
