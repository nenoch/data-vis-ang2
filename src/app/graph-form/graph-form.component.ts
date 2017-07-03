import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-graph-form',
  templateUrl: './graph-form.component.html',
  styleUrls: ['./graph-form.component.css']
})
export class GraphFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  onSubmit(form) {
    console.log(form.value.x);
    console.log(form.value.y);
    // TODO Finish this.
  }
}
