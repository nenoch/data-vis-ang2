import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AxisData } from './axis-data';

@Component({
  selector: 'app-graph-form',
  templateUrl: './graph-form.component.html',
  styleUrls: ['./graph-form.component.css']
})
export class GraphFormComponent implements OnInit {

  axisData: AxisData;

  constructor() { }

  ngOnInit() {
    this.axisData = new AxisData('', '');
  }

  transferDataSuccess(event) {
    const axis = event.mouseEvent.target.name
    this.axisData[`${axis}Column`] = event.dragData;
  }

  onSubmit(form) {
    console.log(form.value.x);
    console.log(form.value.y);
    // TODO Finish this.
  }
}
