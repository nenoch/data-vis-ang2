import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {
  @ViewChild('barchart') private barContainer: ElementRef;
  private data;
  private xAxis;
  private yAxis;
  private margin = {top: 20, right: 20, bottom: 30, left: 45};
  private width: number;
  private height: number;
  private colours;

  constructor(private dataService: DataService, private errorService: ErrorHandlerService) {}

  ngOnInit() {
    this.getData();
  }

  private getData() {
    this.dataService.dataStream.subscribe((data) => {
      this.data = data;
      this.setAxes();
      if (this.data.length !== 0){
        this.createBarchart();
      }
    });
  }

  private setAxes(){
    let axes = [];
    for (var k in this.data[0]) {
      axes.push(k)
    }
    this.xAxis = axes[0];
    this.yAxis = axes[1];
  }


  private createBarchart(){
    // Grab the element in the DOM
    this.resetBarchart();
    let element = this.barContainer.nativeElement;
    this.width = 700 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;
    this.colours = d3.scaleLinear()
                    .domain([0, this.data.length])
                    .range(['red', 'blue']);


    // Set the range
    let x = d3.scaleBand()
              .range([0, this.width])
              .padding(0.1);
    let y = d3.scaleLinear()
              .range([this.height, 0]);

    let svg = d3.select(element).append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + this.margin.left + "," + this.margin.top + ")");


      // Scale the range of the data in the domains
      x.domain(this.data.map(function(d) { return d[this.xAxis] }.bind(this)));
      y.domain([0, d3.max(this.data, function(d) { return d[this.yAxis] }.bind(this))]);

      // append the rectangles for the bar chart
      svg.selectAll(".bar")
          .data(this.data)
        .enter().append("rect")
          .attr("class", "bar")
          .style("fill", function(d,i){ return this.colours(i)}.bind(this))
          .attr("x", function(d) { return x(d[this.xAxis]); }.bind(this))
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d[this.yAxis]); }.bind(this))
          .attr("height", (d) => this.setBarHeight(d,y) );

      // X Axis
      svg.append("g")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3.axisBottom(x))
        .append("text")
          .attr("class", "label-style")
          .attr("x", this.width)
          .attr("y", 8)
          .attr("dy", "0.71em")
          .attr("text-anchor", "middle")
          .text(this.xAxis);

      // Y Axis
      svg.append("g")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("class", "label-style")
          .attr("y", -6)
          .attr("text-anchor", "middle")
          .text(this.yAxis);
  }

  private setBarHeight(d,y){
    if (isNaN(this.height - y(d[this.yAxis]))) {
      this.errorService.handleError({
        title: "Y Axis Error",
        content: "Please enter a numeric value for the Y Axis."
      });
      this.resetBarchart();
    }
    else {
      return this.height - y(d[this.yAxis]);
    }
  }

  private resetBarchart(){
    let svg = d3.select('svg');
    svg.remove();
  }

}
