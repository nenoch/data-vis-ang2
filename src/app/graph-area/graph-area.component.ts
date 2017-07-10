import { Component, OnInit, AfterViewInit, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { GraphDirective } from './graph.directive';
import { Graph } from './graph';
import { GraphComponent } from './graph.component';


@Component({
  selector: 'app-graph-area',
  templateUrl: './graph-area.component.html',
  styleUrls: ['./graph-area.component.css']
})
export class GraphAreaComponent implements OnInit, AfterViewInit {

  @Input() graph: Graph;
  @ViewChild(GraphDirective) graphHost: GraphDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  loadGraph() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.graph.component)
    const viewContainerRef = this.graphHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<GraphComponent>componentRef.instance).data = this.graph.data;
  }

}
