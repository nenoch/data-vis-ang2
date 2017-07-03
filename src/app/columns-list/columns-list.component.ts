import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-columns-list',
  templateUrl: './columns-list.component.html',
  styleUrls: ['./columns-list.component.css']
})

export class ColumnsListComponent implements OnInit {
  columns: any = [];

  ngOnInit() {
    this.columns = ['date', 'value'];  }
}
