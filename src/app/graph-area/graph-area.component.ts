import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-graph-area',
  templateUrl: './graph-area.component.html',
  styleUrls: ['./graph-area.component.css']
})
export class GraphAreaComponent implements OnInit {

  @Input()
  graph: String

  constructor() { }

  ngOnInit() {
  }

}
