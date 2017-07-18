import { Component, OnInit } from '@angular/core';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-data-preview',
  templateUrl: './data-preview.component.html',
  styleUrls: ['./data-preview.component.css']
})
export class DataPreviewComponent implements OnInit {

  private columns: Array<any> = [];
  private rows: Array<any> = [];
  private rowsToDisplay: Array<any> = [];
  private currentRow = 10;
  public scrollCallback;

  constructor(private dataService: DataService) {
    this.scrollCallback = this.displayRows.bind(this);
  }

  ngOnInit() {
    this.getCSV();
  }

  private getCSV() {
    this.dataService.getCSV().subscribe(
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
}
