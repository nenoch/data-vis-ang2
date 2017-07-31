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
    private margin = {top: 50, right: 25, bottom: 100, left: 60};
    private width: number;
    private height: number;
    private aspectRatio = 0.8;
    private barColours;
    private subscription: ISubscription;
    private animate = true;
    private style = 'vertical';

    @HostListener('window:resize', ['$event'])
    onKeyUp(ev: UIEvent) {
        if (this.dataExists()) {
            this.createBarchart(false, this.style);
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
            this.drawGraph();
        });
    }

    private drawGraph() {
        if (this.dataExists()) {
            this.setAxes();
            this.createBarchart(this.animate, this.style);
        }
    }

    private dataExists(): boolean {
        return this.data.length !== 0;
    }

    private setAxes() {
        const axes = [];
        for (const axis in this.data[0]) {
            if (this.data[0].hasOwnProperty(axis)) {
                axes.push(axis)
            }
        }
        if (this.isHorizontal(this.style)) {
            [this.yAxis, this.xAxis] = axes;
            return;
        }
        [this.xAxis, this.yAxis] = axes;
    }

    private setSize() {
        const container = this.barContainer.nativeElement;
        this.width = container.offsetWidth - this.margin.left - this.margin.right;
        this.height = this.aspectRatio * this.width - this.margin.top - this.margin.bottom;
    }

    private switchStyle(style: string) {
        this.style = style;
        this.drawGraph();
    }


    private createBarchart(animate: boolean, style: string) {
        this.resetBarchart();

        // Check correct data types for relevant axis
        if (this.isHorizontal(style)) {
            if (this.chartUtils.checkAxisError(this.data, this.xAxis, 'Y')) { return }; // Return if xaxis is a string
        } else {
            if (this.chartUtils.checkAxisError(this.data, this.yAxis, 'Y')) { return }; // Return if yaxis is a string
        }

        // Grab the element in the DOM
        const element = this.barContainer.nativeElement;

        // Prepare svg
        this.setSize();
        const svg = d3.select(element)
            .append('svg')
                .attr('id', 'chart')
                .attr('width', this.width + this.margin.left + this.margin.right)
                .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
                .attr('transform',
                    'translate(' + this.margin.left + ',' + this.margin.top + ')');

        // Set colours
        this.barColours = d3.scaleLinear()
            .domain([0, this.data.length])
            .range(['#0056b8', '#7ECEFC']);

        // Set the range
        let axes = {x: '', y: ''};
        axes = this.defineScales(style, axes)

        // Scale the range of the data in the domains
        axes = this.defineDomains(style, axes);

        // X Axis
        const xAxis = svg.append('g')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(axes.x));
        xAxis.selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)' );

        // X Axis label
        xAxis.append('text')
            .attr('class', 'label-style')
            .attr('x', 8)
            .attr('y', -this.width)
            .attr('dy', -6)
            .attr('transform', 'rotate(90)' )
            .attr('text-anchor', 'middle')
            .text(this.xAxis);

        // Y Axis
        const yAxis = svg.append('g')
            .call(d3.axisLeft(axes.y));
        yAxis.selectAll('text')
            .attr('transform', 'rotate(20)');

        // Y Axis label
        yAxis.append('text')
            .attr('class', 'label-style')
            .attr('y', -15)
            .attr('text-anchor', 'middle')
            .text(this.yAxis);

        this.appendBars(style, svg, axes, animate);
    }

    private defineScales(style, axes) {
        if (this.isHorizontal(style)) {
            axes.x = d3.scaleLinear().rangeRound([0, this.width]);
            axes.y = d3.scaleBand().rangeRound([this.height, 0]).padding(0.1);
            return axes;
        }
        axes.x = d3.scaleBand().range([0, this.width]).padding(0.1);
        axes.y = d3.scaleLinear().range([this.height, 0]);
        return axes;
    }

    private defineDomains(style, axes) {
        if (this.isHorizontal(style)) {
            axes.x.domain([0, d3.max(this.data, (d) =>  d[this.xAxis])]);
            axes.y.domain(this.data.map((d) =>  d[this.yAxis]));
            return axes;
        }
        axes.x.domain(this.data.map((d) =>  d[this.xAxis]));
        axes.y.domain([0, d3.max(this.data, (d) =>  d[this.yAxis])]);
        return axes;
    }

    private appendBars(style: string, svg, axes, animate: boolean) {
        let bars = svg.selectAll('.bar')
            .data(this.data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .style('fill', (d, i) => this.barColours(i) );

        if (this.isHorizontal(style)) {
            bars.attr('x', 0)
                .attr('y', (d) => axes.y(d[this.yAxis]))
                .attr('height', axes.y.bandwidth());

            if (animate) { bars = this.animation(style, bars)};
            bars.attr('width', (d) => axes.x(d[this.xAxis]))
            return;
        }
        bars.attr('x', (d) => axes.x(d[this.xAxis]))
            .attr('width', axes.x.bandwidth())
            .attr('y', (d) => this.height);

        if (animate) { bars = this.animation(style, bars)};
        bars.attr('height', (d) => this.height - axes.y(d[this.yAxis]))
            .attr('y', (d) => axes.y(d[this.yAxis]));
        return;
    }

    private animation(style, bars) {
        let direction;
        const growthDuration = 100 * (175 / this.data.length),
              barDelay = 10 * (200 / this.data.length);

        this.isHorizontal(style) ? direction = 'width' : direction = 'height';
        return bars.attr(direction, 0)
            .transition()
            .duration(growthDuration)
            .delay((d, i) => {
                return i * barDelay;
            })
    }

    private setBarHeight(d, y): number {
        return this.height - y(d[this.yAxis]);
    }

    private resetBarchart() {
        this.chartUtils.resetSVG();
    }

    private isHorizontal(style: string): boolean {
        return (style === 'horizontal');
    }
}
