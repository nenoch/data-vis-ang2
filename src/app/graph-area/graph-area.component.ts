import { Component, OnInit, AfterViewInit, Input, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { GraphComponent } from './graph.component';
import { GraphService } from './graph.service';
import { GraphDirective } from './graph.directive';
import { Graph } from './graph';


@Component({
  selector: 'app-graph-area',
  templateUrl: './graph-area.component.html',
  styleUrls: ['./graph-area.component.css']
})
export class GraphAreaComponent implements OnInit, AfterViewInit {

  // @Input() graph: Graph;
  private graph: Graph;

  @ViewChild(GraphDirective) graphHost: GraphDirective;

  constructor(private componentFactoryResolver: ComponentFactoryResolver, private graphService: GraphService) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.graphService.selectedGraph.subscribe((graphComponent) => {
      // TODO Stuff to load graph
    })
    this.loadGraph();
  }

  loadGraph() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.graph.component)
    const viewContainerRef = this.graphHost.viewContainerRef;
    viewContainerRef.clear();
    const componentRef = viewContainerRef.createComponent(componentFactory);
    (<GraphComponent>componentRef.instance).data = this.graph.data;
  }

}
