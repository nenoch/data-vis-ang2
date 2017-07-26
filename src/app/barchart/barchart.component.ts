import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import { DataService } from '../shared/data.service';
import { ChartUtilsService } from '../shared/chart-utils.service';
import { ISubscription } from 'rxjs/Subscription';

import * as d3 from 'd3';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit, OnDestroy {
  @ViewChild('barchart') private barContainer: ElementRef;
  private data;
  private xAxis;
  private yAxis;
  private margin = {top: 50, right: 20, bottom: 100, left: 45};
  private width: number;
  private height: number;
  private aspectRatio = 0.7;
  private barColours;
  private subscription: ISubscription;
  private animate: Boolean = true;

  @HostListener('window:resize', ['$event'])
  onKeyUp(ev: UIEvent) {
    if (this.dataExists()) {
        this.createBarchart();
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
        this.createBarchart(this.animate);
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
    const container = this.barContainer.nativeElement;
    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.aspectRatio * this.width - this.margin.top - this.margin.bottom;
  }


  private createBarchart(animate: Boolean = false) {
    this.resetBarchart();
    if (this.chartUtils.checkYAxisError(this.data, this.yAxis)) { return } // Return if yaxis is a string
    this.setSize();

    // Grab the element in the DOM
    const element = this.barContainer.nativeElement;

    this.barColours = d3.scaleLinear()
                    .domain([0, this.data.length])
                    .range(['#0056b8', '#7ECEFC']);


    // Set the range
    const x = d3.scaleBand()
              .range([0, this.width])
              .padding(0.1);
    const y = d3.scaleLinear()
              .range([this.height, 0]);

    const svg = d3.select(element).append('svg')
        .attr('id', 'chart')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform',
              'translate(' + this.margin.left + ',' + this.margin.top + ')');


      // Scale the range of the data in the domains
      x.domain(this.data.map((d) => d[this.xAxis] ));
      y.domain([0, d3.max(this.data, (d) => d[this.yAxis])]);


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
          .attr('x', 8)
          .attr('y', -this.width)
          .attr('dy', -6)
          .attr('transform', 'rotate(90)' )
          .attr('text-anchor', 'middle')
          .text(this.xAxis);

      // Y Axis
      svg.append('g')
          .call(d3.axisLeft(y))
        .append('text')
          .attr('class', 'label-style')
          .attr('y', -6)
          .attr('text-anchor', 'middle')
          .text(this.yAxis);

      this.appendBars(svg, x, y, animate);
  }

  private appendBars(svg, x, y, animate: Boolean) {
    if (animate) {
      svg.selectAll('.bar')
          .data(this.data)
        .enter().append('rect')
          .attr('class', 'bar')
          .style('fill', (d, i) => this.barColours(i) )
          .attr('x', (d) => x(d[this.xAxis]) )
          .attr('y', (d) => this.height)
          .attr('width', x.bandwidth())
          // Animation Start
          .attr('height', 0)
          .transition()
          .duration(1000)
          .delay(function (d, i) {
              return i * 125;
          })
          .attr('height', (d) => this.setBarHeight(d, y) )
          .attr('y', (d) => y(d[this.yAxis]) );
    } else {
      svg.selectAll('.bar')
          .data(this.data)
        .enter().append('rect')
          .attr('class', 'bar')
          .style('fill', (d, i) => this.barColours(i) )
          .attr('x', (d) => x(d[this.xAxis]) )
          .attr('width', x.bandwidth())
          .attr('y', (d) => y(d[this.yAxis]) )
          .attr('height', (d) => this.setBarHeight(d, y) );
    }
  }

  private setBarHeight(d, y) {
      return this.height - y(d[this.yAxis]);
  }

  private resetBarchart() {
    this.chartUtils.resetSVG();
  }
}
