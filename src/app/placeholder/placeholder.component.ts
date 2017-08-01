import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.css']
})
export class PlaceholderComponent implements OnInit {
  public title: string = "Data Visualisation Area";
  public img:string = 'assets/imgs/data-vis.svg';
  constructor() { }

  ngOnInit() {
  }

}
