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
  private showAmount = 10;
  private scrollAmount = 10;
  private firstRow = 0;
  private stopRow: number = this.showAmount;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getCSV().subscribe(
      data => {
        this.columns = data.columns;
        this.rows = this.convertRows(data);
      },
      error =>  console.log(error)
    );
  }

  public showNext(event) {
    this.firstRow += this.scrollAmount;
    this.stopRow += this.scrollAmount;
  }

  private convertRows(data) {
    const rows = [];
    for (let i = 1; i < data.length; i++) {
      rows.push(data[i]);
      rows[i - 1] = Object.keys(rows[i - 1]).map(k => rows[i - 1][k])
    }
    return rows;
  }
}
