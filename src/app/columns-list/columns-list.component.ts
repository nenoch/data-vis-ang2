import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

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

  getColumns(){
    this.dataService.getCSVColumns().subscribe(
      data => this.columns = data,
      error =>  console.log(error)
    );
  }

}
