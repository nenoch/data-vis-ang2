import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-placeholder',
  templateUrl: './placeholder.component.html',
  styleUrls: ['./placeholder.component.css']
})
export class PlaceholderComponent implements OnInit {
  public img: string = 'assets/imgs/data-vis.svg';
  constructor() { }

  ngOnInit() {
  }

}
