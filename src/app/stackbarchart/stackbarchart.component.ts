import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import { DataService } from '../shared/data.service';
import { ChartUtilsService } from '../shared/chart-utils.service';
import { ISubscription } from 'rxjs/Subscription';

import * as d3 from 'd3';

@Component({
  selector: 'app-stackbarchart',
  templateUrl: './stackbarchart.component.html',
  styleUrls: ['./stackbarchart.component.css']
})
export class StackbarchartComponent implements OnInit, OnDestroy {
  @ViewChild('stackbarchart') private stackbarContainer: ElementRef;
  private data;
  private xAxis;
  private xValues;
  private zKey;
  private zValues = [];
  private margin = {top: 50, right: 20, bottom: 100, left: 45};
  private width: number;
  private height: number;
  private aspectRatio = 0.7;
  private stackbarColours;
  private subscription: ISubscription;
  private animate: Boolean = true;

  constructor(private dataService: DataService, private chartUtils: ChartUtilsService) { }

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
        this.createStackbarchart();
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
    this.zKey = axes[1];
  }

  private setSize() {
    const container = this.stackbarContainer.nativeElement;
    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.aspectRatio * this.width - this.margin.top - this.margin.bottom;
  }

  private createStackbarchart() {
    this.resetStackbarchart();
    // if (this.chartUtils.checkYAxisError(this.data, this.yAxis)) { return } // Return if yaxis is a string
    this.setSize();

    const element = this.stackbarContainer.nativeElement;

    this.stackbarColours = d3.scaleOrdinal(d3.schemeCategory20c);

    let layers = this.generateStackData();

    let yStackMax = d3.max(layers, function(layer) {
      return d3.max(layer, function(d) {
        return d[1];
      });
    });

    const x = d3.scaleBand()
              .domain(this.xValues)
              .range([0, this.width])
              .padding(0.1);

    const y = d3.scaleLinear()
              .domain([0, yStackMax])
              .range([this.height, 0]);

    const z = d3.scaleBand().domain(this.zValues).rangeRound([0, x.bandwidth()]);

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
        .attr("transform", "translate(0,0)")
        .call(d3.axisLeft(y));

    let layer = svg.selectAll(".layer")
        .data(layers)
      .enter().append("g")
        .attr("class", "layer")
        .style("fill", (d, i) => this.stackbarColours(i));

    let rect = layer.selectAll("rect")
        .data(function(d) { return d; })
      .enter().append("rect")
        .attr("x", function(d) {
          return x(d.xkey); })
        .attr("y", this.height)
        .attr("width", x.bandwidth())
        .attr("height", 0);

    rect.transition()
        .delay(function(d, i) { return i * 10; })
        .attr("y", function(d) {
            return y(d[1]);
        })
        .attr("height", function(d) {
            return y(d[0]) - y(d[1]);
        });

    this.addLegenda();
  }

  private generateStackData(){

    let groups = {};

    this.data.forEach((d) => {
      if(!groups[d[this.xAxis]]) {
        groups[d[this.xAxis]] = [d];
      } else {
        groups[d[this.xAxis]].push(d)
      }
    })

    this.xValues = Object.keys(groups);
    this.zValues = [];

    this.data.forEach((d) => {
      if(!this.zValues.includes(d[this.zKey])) {
        this.zValues.push(d[this.zKey]);
      }
    });

    let barValues = [];

    this.xValues.forEach((value,i) => {
      var xdata = {};
      groups[value].forEach((item) => {
        if(!xdata[item[this.zKey]]) {
          xdata[item[this.zKey]] = 1
        } else {
          xdata[item[this.zKey]]++;
        }
      })
      // "result" is an ordered array with a count for each x by z categories
      var result = {};
      this.zValues.forEach(function(g) {
        result[g]= xdata[g]||0;
      })
      barValues.push(result)
    })

    let keys = this.zValues.length; // number of layers (n)
    let bars = barValues.length; // number of bars (m)
    let stack = d3.stack().keys(this.zValues);

    let layers = stack(barValues); // calculate the stack layout

    layers.forEach((d,i) => { //adding keys to every datapoint
      d.forEach((dd,j) => {
          dd.xkey = this.xValues[j];
          dd.zkey = this.zValues[i];
      })
    });
    return layers;
  }

  private addLegenda(){

    let svg = d3.select('svg#chart');

    var legend = svg.selectAll(".legend")
        .data(this.zValues)
      .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
        .attr("x", this.width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => this.stackbarColours(i));

    legend.append("text")
        .attr("x", this.width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });
  }

  private resetStackbarchart() {
    this.chartUtils.resetSVG();
  }

}
