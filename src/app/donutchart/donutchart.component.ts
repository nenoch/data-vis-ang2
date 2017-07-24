import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener} from '@angular/core';
import { DataService } from '../shared/data.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { ChartUtilsService } from '../shared/chart-utils.service';
import { ISubscription } from 'rxjs/Subscription';

import * as d3 from 'd3';

@Component({
  selector: 'app-donutchart',
  templateUrl: './donutchart.component.html',
  styleUrls: ['./donutchart.component.css']
})
export class DonutchartComponent implements OnInit, OnDestroy {
  @ViewChild('donutchart') private donutContainer: ElementRef;
  private data;
  private category;
  private variable;
  private margin = {top: 50, right: 20, bottom: 100, left: 45};
  private width: number;
  private height: number;
  private colour = d3.scaleOrdinal(d3.schemeCategory20c);
  private padAngle = 0.015;
  private cornerRadius = 3;
  private subscription: ISubscription;
  private animate = true;

  @HostListener('window:resize', ['$event'])
  onKeyUp(ev: UIEvent) {
    if (this.dataExists()) {
        this.createDonutchart(false);
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
        this.createDonutchart(this.animate);
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
    this.category = axes[0];
    this.variable = axes[1];
  }

  private setSize() {
    const container = this.donutContainer.nativeElement;
    this.width = container.offsetWidth - this.margin.left - this.margin.right;
    this.height = this.width - this.margin.top - this.margin.bottom;
  }

  private createDonutchart(animate: boolean) {
    this.resetBarchart();
    this.setSize();

    const element = this.donutContainer.nativeElement;
    const radius = Math.min(this.width, this.height) / 2;

    const pie = d3.pie()
      .value(d => d[this.variable])
      .sort(null);

    const arc = d3.arc()
      .outerRadius(radius * 1)
      .innerRadius(radius * 0.7)
      .cornerRadius(this.cornerRadius)
      .padAngle(this.padAngle);

    const outerArc = d3.arc()
      .outerRadius(radius * 0.9)
      .innerRadius(radius * 0.9);

    const svg = d3.select(element).append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform',
              'translate(' + (this.width + this.margin.left) / 2 + ',' + ((this.height + this.margin.top) / 2 )  + ')');

    const sliceGroup = svg.append('g').attr('class', 'slices');
    const path = this.drawSlices(sliceGroup, pie, arc, animate);

    const labelGroup = svg.append('g').attr('class', 'labelGroup');
    labelGroup.append('g').attr('class', 'labelName');
    labelGroup.append('g').attr('class', 'lines');

    const label = this.drawLabels(labelGroup, pie, outerArc, radius);
  }

  private drawSlices(sliceGroup, pie, arc, animate: boolean) {
    const slices = sliceGroup.datum(this.data)
      .selectAll('path')
      .data(pie)
      .enter().append('path')
      .attr('fill', d => this.colour(d.data[this.category]));

    if (animate) {
      return slices.transition()
                   .delay((d, i) => i * 100)
                   .duration(1000)
                   .attrTween('d', d => {
                      const i = d3.interpolate(d.startAngle, d.endAngle);
                      return t => {
                        d.endAngle = i(t);
                        return arc(d);
                      }
                  });
    } else {
      return slices.attr('d', arc);
    }
  }

  private drawLabels(labelGroup, pie, outerArc, radius) {
    return labelGroup.datum(this.data)
                            .select('.labelName')
                            .selectAll('text')
                            .data(pie)
                            .enter()
                            .append('text')
                            .attr('dy', '.35em')
                            .html( d => {
                              return `${d.data[this.category]}: <tspan>${d.data[this.variable]}</tspan>`;
                            })
                            .attr('transform', d => {
                              const pos = outerArc.centroid(d);
                              pos[0] = radius * 0.95 * (this.midAngle(d) < Math.PI ? 1 : -1);
                              // return `translate('${pos}')`;
                              return 'translate(' + pos + ')';
                            })
                            .style('text-anchor', d => {
                              return (this.midAngle(d)) < Math.PI ? 'start' : 'end';
                            })
  }

  private midAngle(d) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }

  private resetBarchart() {
    this.chartUtils.resetSVG();
  }
}
