import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AxisData } from './axis-data';

@Component({
  selector: 'app-graph-form',
  templateUrl: './graph-form.component.html',
  styleUrls: ['./graph-form.component.css']
})
export class GraphFormComponent implements OnInit {

  private axisData: AxisData;

  constructor() { }

  ngOnInit() {
    this.axisData = new AxisData('', '');
  }

  private transferDataSuccess(event) {
    const axis = event.mouseEvent.target.name
    this.axisData[`${axis}Column`] = event.dragData;
  }

  private onSubmit(form: NgForm) {
    console.log(this.axisData);
    // TODO Finish this-----
    // Generates graph from axis data provided
  }
}
