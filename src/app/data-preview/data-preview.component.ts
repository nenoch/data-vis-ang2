import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';
import { DataFilter } from './data-filter';

@Component({
  selector: 'app-data-preview',
  templateUrl: './data-preview.component.html',
  styleUrls: ['./data-preview.component.css'],
})
export class DataPreviewComponent implements OnInit {

  public scrollCallback;

  private columns: Array<any> = [];
  private rows: Array<any> = [];
  private rowsToDisplay: Array<any> = [];
  private initialRows = 25;
  private currentRow: number = this.initialRows;
  private filter: DataFilter;

  constructor(private dataService: DataService) {
    this.scrollCallback = this.displayRows.bind(this);
  }

  ngOnInit() {
    this.getCSV(null);
    this.filter = new DataFilter(null, null);
  }

  private getCSV(filter) {
    this.dataService.getCSV(filter).subscribe(
      data => {
        this.columns = data.columns;
        this.rows = this.convertRows(data);
        this.displayRows();
      },
      error =>  console.log(error)
    );
  }

  private displayRows() {
    this.rowsToDisplay = this.rows.slice(0, this.currentRow);
    this.currentRow++;
    return this.rowsToDisplay;
  }

  private convertRows(data) {
    const rows = [];
    for (let i = 0; i < data.length; i++) {
      rows.push(data[i]);
      rows[i] = Object.keys(rows[i]).map(k => rows[i][k]);
    }
    return rows;
  }

  private filterKeyUp(column, filterString) {
    this.filter.column = column;
    this.filter.filterString = filterString;
    this.getCSV(this.filter);
  }
}
