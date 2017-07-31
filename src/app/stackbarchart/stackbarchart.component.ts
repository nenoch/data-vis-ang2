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
  private barsColours;
  private subscription: ISubscription;
  private animate: boolean = true;
  private style = 'stacked';

  @HostListener('window:resize', ['$event'])
  onKeyUp(ev: UIEvent) {
    if (this.dataExists()) {
        this.createMultibarsChart(false, this.style);
      }
  }

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
          this.drawGraph();
      });
  }

  private drawGraph() {
      if (this.dataExists()) {
          this.setAxes();
          this.createMultibarsChart(this.animate, this.style);
      }
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

  private switchStyle(style: string) {
      this.style = style;
      this.drawGraph();
  }

  private createMultibarsChart(animate: boolean, style: string) {

    this.resetMultibarsChart();
    if (this.chartUtils.checkZKeyError(this.data, this.zKey)) { return } // Return if yaxis is a string
    this.setSize();

    const element = this.stackbarContainer.nativeElement;

    this.barsColours = d3.scaleOrdinal(d3.schemeCategory20c);

    let layers = this.generateStackData();

    const x = d3.scaleBand()
              .domain(this.xValues)
              .range([0, this.width])
              .padding(0.1);

    let yMax = this.setYmax(layers);

    const y = d3.scaleLinear()
              .domain([0, yMax])
              .range([this.height, 0]);

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

    this.appendBars(x,y,svg,layers,animate);
    this.addLegend(svg);
  }

  private isStacked(style: string): boolean {
      return (style === 'stacked');
  }

  private setYmax(layers){
    if (this.isStacked(this.style)) {
      return d3.max(layers, function(layer) {
        return d3.max(layer, function(d) {
          return d[1];
        });
      });
    } else {
      return d3.max(layers, function(layer) {
        return d3.max(layer, function(d) {
          return d[1] - d[0];
        });
      });
    }
  }

  private appendBars(x,y,svg,layers, animate: boolean){
    let layer = svg.selectAll(".layer")
        .data(layers)
      .enter().append("g")
        .attr("class", "layer")
        .style("fill", (d, i) => this.barsColours(i));

    this.toggleGroupStack(layer, x,y,animate);

  }

  private toggleGroupStack(layer,x,y,animate: boolean) {
    if (this.isStacked(this.style)) {
      this.appendStackBars(layer,x,y,animate);
    } else {
      this.appendGroupBars(layer,x,y,animate);
    }
  }

  private appendGroupBars(layer,x,y,animate: boolean){
    let z = d3.scaleBand().domain(this.zValues).rangeRound([0, x.bandwidth()]);
    let keysNum = this.zValues.length;

    if (animate){
    let rect = layer.selectAll("rect")
             .data((d) => d)
          .enter().append("rect")
             .attr("y", this.height)
             .transition()
             .delay((d, i) => i * 10 )
             .attr("x", (d) => x(d.xkey)+ z(d.zkey))
             .attr("width", x.bandwidth() / keysNum)
             .transition()
             .attr("y", (d) => y(d.data[d.zkey]))
             .attr("height", (d) => this.height - y(d.data[d.zkey]));
    } else {
    let rect = layer.selectAll("rect")
            .data((d) => d)
          .enter().append("rect")
            .attr("x", (d) => x(d.xkey)+ z(d.zkey))
            .attr("width", x.bandwidth() / keysNum)
            .attr("y", (d) => y(d.data[d.zkey]))
            .attr("height", (d) => this.height - y(d.data[d.zkey]));
    }
  }

  private appendStackBars(layer,x,y,animate: boolean){
    if (animate) {
      let rect = layer.selectAll("rect")
          .data((d) => d)
        .enter().append("rect")
          .attr("x", (d) => x(d.xkey))
          .attr("y", this.height)
          .attr("width", x.bandwidth())
          .attr("height", 0);

      rect.transition()
          .delay((d, i) => i * 10)
          .attr("y", (d) => y(d[1]))
          .attr("height", (d) => y(d[0]) - y(d[1]));

    } else {
      let rect = layer.selectAll("rect")
          .data((d) => d)
        .enter().append("rect")
          .attr("x", (d) => x(d.xkey))
          .attr("y", (d) => y(d[1]))
          .attr("height", (d) => y(d[0]) - y(d[1]))
          .attr("width", x.bandwidth());
    }
  }

  private generateStackData(){
    let groups = {};
    let barValues = [];

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
      let result = {};
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

  private addLegend(svg){
    let legend = svg.selectAll(".legend-key")
              .data(this.zValues)
              .enter().append("g")
              .attr("transform", (d, i) => `translate(0,${i*13})`);
              // .attr("transform", (d, i) => `translate(${-this.width},${(this.height+30)+(i*13)})`);

    legend.append("text")
          .attr("x", this.width - 24)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .attr("class", "label-style")
          .text(function(d) { return d; });

    legend.append("rect")
        .attr("x", this.width - 18)
        .attr("width", 18)
        .attr("height", 5)
        .style("fill", (d, i) => this.barsColours(i));

  }

  private resetMultibarsChart() {
    this.chartUtils.resetSVG();
  }

}
