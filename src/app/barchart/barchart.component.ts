import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
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
  private aspectRatio = 0.7;
  private colours;

  @HostListener('window:resize', ['$event'])
  onKeyUp(ev: UIEvent) {
    if (this.dataExists()) {
        this.createBarchart();
      }
  }

  constructor(private dataService: DataService, private errorService: ErrorHandlerService) {}


  ngOnInit() {
    this.getData();
  }

  private getData() {
    this.dataService.dataStream.subscribe((data) => {
      this.data = data;
      this.setAxes();
      if (this.dataExists()) {
        this.createBarchart();
      }
    });
  }

  private dataExists() {
    return this.data.length !== 0;
  }

  private setAxes(){
    let axes = [];
    for (var k in this.data[0]) {
      axes.push(k)
    }
    this.xAxis = axes[0];
    this.yAxis = axes[1];
  }

  private setSize() {
    const container = this.barContainer.nativeElement;
    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.aspectRatio * this.width - this.margin.top - this.margin.bottom;
  }


  private createBarchart(){
    // Grab the element in the DOM
    this.resetBarchart();
    this.setSize();

    let element = this.barContainer.nativeElement;

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
      x.domain(this.data.map((d) => d[this.xAxis] ));
      y.domain([0, d3.max(this.data, (d) => d[this.yAxis])]);

      // append the rectangles for the bar chart
      svg.selectAll(".bar")
          .data(this.data)
        .enter().append("rect")
          .attr("class", "bar")
          .style("fill", (d,i) => this.colours(i) )
          .attr("x", (d) => x(d[this.xAxis]) )
          .attr("width", x.bandwidth())
          .attr("y", (d) => y(d[this.yAxis]) )
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
    let error = { title: "Y Axis Error", content: "Please enter a numeric value for the Y Axis."};
    if (isNaN(this.height - y(d[this.yAxis]))) {
      this.errorService.handleError(error);
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
