import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css']
})
export class BarchartComponent implements OnInit {
  @ViewChild('barchart') private barContainer: ElementRef;
  private data = [
 {
   "day": "Monday",
   "people": "1234"
 },
 {
   "day": "Tuesday",
   "people": "2345"
 },
 {
   "day": "Wednesday",
   "people": "3456"
 },
 {
   "day": "Thursday",
   "people": "4567"
 },
 {
   "day": "Friday",
   "people": "5678"
 },
 {
   "day": "Saturday",
   "people": "6789"
 },
 {
   "day": "Sunday",
   "people": "1010"
 }
];
  private margin = {top: 20, right: 20, bottom: 30, left: 40};
  private width: number;
  private height: number;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    console.log(this.data);
    this.createBarchart();
  }

  createBarchart(){
    // Grab the element in the DOM
    let element = this.barContainer.nativeElement;
    this.width = 700 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;

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
      x.domain(this.data.map(function(d) { return d.day }));
      y.domain([0, d3.max(this.data, function(d) { return d.people })]);

      // append the rectangles for the bar chart
      svg.selectAll(".bar")
          .data(this.data)
        .enter().append("rect")
          .attr("class", "bar")
          .attr("fill", "steelblue")
          .attr("x", function(d) { return x(d.day); })
          .attr("width", x.bandwidth())
          .attr("y", function(d) { return y(d.people); })
          .attr("height", function(d) { return this.height - y(d.people); }.bind(this));

      // add the x Axis
      svg.append("g")
          .attr("transform", "translate(0," + this.height + ")")
          .call(d3.axisBottom(x));

      // add the y Axis
      svg.append("g")
          .call(d3.axisLeft(y));
  }

}
