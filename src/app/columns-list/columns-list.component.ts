import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.css']
})

export class ColumnsListComponent implements OnInit {
  columns: any = [];

  constructor(private dataService: DataService){}

  ngOnInit() {
    this.getColumns();
    this.tryD3();
  }

  getColumns(){
    this.dataService.getCSVColumns().subscribe(
      data => this.columns = data,
      error =>  console.log(error)
      );
  }

  tryD3(){
    d3.csv('assets/mock-data/data.csv', function(d) {
      let axisData = {xColumn: "people", yColumn: "day"};

      return {
        [axisData.xColumn] : +d[axisData.xColumn],
        [axisData.yColumn] : d[axisData.yColumn]
      };
    }, function(data) {
      console.log(data);
      // the last object in the data array holds the columns;
    });
  }

}
