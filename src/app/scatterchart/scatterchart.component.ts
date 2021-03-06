import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import { DataService } from '../shared/data.service';
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
  private radius = '';
  private margin = {top: 50, right: 20, bottom: 100, left: 45};
  private width: number;
  private height: number;
  private aspectRatio = 0.7;
  private circleColour: String = '#0056b8';
  private subscription: ISubscription;
  private animate: boolean = true;

  @HostListener('window:resize', ['$event'])
  onKeyUp(ev: UIEvent) {
    if (this.dataExists()) {
        this.createScatterchart();
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
        this.createScatterchart();
      }
    });
  }

  private dataExists() {
    return this.data.length !== 0;
  }

  private setAxes() {
    this.xAxis = this.data.axes.xColumn;
    this.yAxis = this.data.axes.yColumn;
  }

  private addRadius(event){
    let radius = event.dragData;
    this.radius = radius;
    this.createScatterchart();
  }


  private setSize() {
    const container = this.scatterContainer.nativeElement;
    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.aspectRatio * this.width - this.margin.top - this.margin.bottom;
  }

  private createScatterchart() {
    this.resetScatterchart();
    if (this.chartUtils.checkAxisError(this.data, this.yAxis, 'Y')
        || this.chartUtils.checkRadiusError(this.data, this.radius)) { return };
    this.setSize();

    const element = this.scatterContainer.nativeElement;

    const xScale = this.setXScale();

    const yScale = d3.scaleLinear()
                  .range([this.height, 0])
                  .domain(d3.extent(this.data, d => d[this.yAxis] ));

    const min = element.offsetWidth/120;
    const max = element.offsetWidth/30;

    const rScale = d3.scaleSqrt()
              .domain([0, d3.max(this.data, d => d[this.radius])])
              .range([min,max]);

    const svg = d3.select(element).append('svg')
        .attr('id', 'chart')
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

      let circles = svg.selectAll('.circle')
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
        this.applyTooltips(circles, this.radius);
      }

  }

  private setXScale(){
    if (this.isNumber(this.data[0][this.xAxis])){
      return d3.scaleLinear()
                    .range([0, this.width])
                    .domain(d3.extent(this.data, d => d[this.xAxis]));
    } else {
      return d3.scaleBand()
                .rangeRound([0, this.width])
                .padding(1)
                .domain(this.data.map(d => d[this.xAxis]));
    }
  }

  private applyTooltips(circles, value){

    let div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);

    circles.on("mouseover", function(d) {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html(value+'<br>'+ d[value])
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })
    .on("mouseout", function(d) {
      div.transition()
        .duration(500)
        .style("opacity", 0);
      });
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

  private isNumber(item) {
    if (item == +item) {
      return true;
    } else {
      return false;
    }
  }

}
