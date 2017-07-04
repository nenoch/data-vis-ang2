import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

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
  }

  getColumns() {
    let data = this.dataService.getData();
    for (let k in data[0]) {
      this.columns.push(k);
    }
  }

}
