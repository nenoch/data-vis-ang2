import { Component, OnInit, OnDestroy, ViewChild, ElementRef, HostListener } from '@angular/core';
import { DataService } from '../shared/data.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { ChartUtilsService } from '../shared/chart-utils.service';
import { ISubscription } from 'rxjs/Subscription';
import * as d3 from 'd3';

@Component({
    selector: 'app-linechart',
    templateUrl: './linechart.component.html',
    styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit, OnDestroy {
    @ViewChild('linechart') private lineContainer: ElementRef;
    private data;
    private xAxis;
    private yAxis = [];
    private margin = {top: 50, right: 20, bottom: 100, left: 45};
    private width: number;
    private height: number;
    private aspectRatio = 0.7;
    private lineColours;
    private subscription: ISubscription;
    private animate = true;

    @HostListener('window:resize', ['$event'])
    onKeyUp(ev: UIEvent) {
        if (this.dataExists()) {
            this.createLinechart(false);
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
            this.createLinechart(this.animate);
        }
        });
    }

    private addLine(event) {
        const y = event.dragData
        console.log(y);
        if (this.chartUtils.checkAxisError(this.data, y, 'Y')) { return; };
        this.yAxis.push(y);
        console.log(this.yAxis);
        this.createLinechart(this.animate);
    }

    private dataExists() {
        return this.data.length !== 0;
    }

    private setAxes() {
        // const axes = [];
        // for (const k in this.data[0]) {
        //     if (this.data[0].hasOwnProperty(k)) {
        //         axes.push(k)
        //     }
        // }
        // this.xAxis = axes[0];
        // this.yAxis.push(axes[1]);
        this.xAxis = this.data.axes.xColumn;
        this.yAxis = [this.data.axes.yColumn];
        console.log(this.yAxis);
    }

    private setSize() {
        const container = this.lineContainer.nativeElement;
        this.width = container.offsetWidth - this.margin.left - this.margin.right;
        this.height = this.aspectRatio * this.width - this.margin.top - this.margin.bottom;
    }


    private createLinechart(animate: boolean) {
        this.resetLinechart();

        let exitFlag = false;
        this.yAxis.forEach(y => {
            if (this.chartUtils.checkAxisError(this.data, y, 'Y')) { exitFlag = true; }; // Return if yaxis is a string
        })
        if (exitFlag) { return; }

        // Grab the element in the DOM
        const element = this.lineContainer.nativeElement;

        // Prepare svg
        this.setSize();
        const svg = d3.select(element).append('svg')
            .attr('id', 'chart')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

        // Set the colours
        this.lineColours = d3.scaleOrdinal(d3.schemeCategory10);

        // Set the range
        let axes = { x: '', y: ''}
        axes = this.defineScales(axes);

        // Scale the range of the data in the domains
        axes = this.defineDomains(axes);

        // Map line data
        const lines = this.lineData(axes);

        // X Axis
        svg.append('g')
            .attr('transform', 'translate(0,' + this.height + ')')
            .call(d3.axisBottom(axes.x))
            .selectAll('text')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em')
            .attr('transform', 'rotate(-65)' );

        // X Axis label
        svg.select('g')
            .append('text')
            .attr('class', 'label-style')
            .attr('x', this.width)
            .attr('y', -6)
            .style('text-anchor', 'end')
            .text(this.xAxis);

        // Y Axis
        svg.append('g')
            .call(d3.axisLeft(axes.y))
            .append('text')
            .attr('class', 'label-style')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text(this.yAxis);

        this.drawLine(svg, lines, animate);
    }

    private defineScales(axes) {
        axes.x = d3.scaleBand()
            .rangeRound([0, this.width])
            .padding(1);
        axes.y = d3.scaleLinear()
            .rangeRound([this.height, 0]);
        return axes;
    }

    private defineDomains(axes) {
        axes.x.domain(this.data.map(d => d[this.xAxis]));
        axes.y.domain([
            d3.min(this.yAxis, y => d3.min(this.data, d => d[y])),
            d3.max(this.yAxis, y => d3.max(this.data, d => d[y]))
        ])
        console.log(d3.min(this.yAxis, y => d3.min(this.data, d => d[y])));
        console.log(d3.max(this.yAxis, y => d3.max(this.data, d => d[y])));
        return axes;
    }

    private lineData(axes): Array<any> {
        const lines = [];
        this.yAxis.forEach(y => {
            const line = d3.line()
                .x(d => axes.x(d[this.xAxis]))
                .y(d => axes.y(d[y]))
            lines.push(line);
        });
        return lines;
    }

    private drawLine(svg, lines, animate: boolean) {
        lines.forEach((line, i) => {
            const path = svg.append('path')
                .datum(this.data)
                .attr('fill', 'none')
                .attr('stroke', this.lineColours(this.yAxis[i]))
                .attr('stroke-linejoin', 'round')
                .attr('stroke-linecap', 'round')
                .attr('stroke-width', 1.5)
                .attr('d', line);
            if (animate) { this.animateLine(path); }
        })
    }

    private animateLine(path) {
        const totalLength = path.node().getTotalLength();
        path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
            .attr('stroke-dashoffset', totalLength)
            .transition()
            .duration(1500)
            .attr('stroke-dashoffset', 0);
    }

    private resetLinechart() {
        this.chartUtils.resetSVG();
    }
}
