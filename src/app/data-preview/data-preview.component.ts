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
  private defaultScrollAmount = 10;
  private scrollUpAmount: number = this.defaultScrollAmount;
  private scrollDownAmount: number = this.defaultScrollAmount;
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

  private showLast(event) {
    this.checkScrollUpAmount();
    this.firstRow -= this.scrollUpAmount;
    this.stopRow -= this.scrollUpAmount;
  }

  private checkScrollUpAmount() {
    const rowsRemaining = this.rows.length - this.firstRow;
    rowsRemaining <= this.scrollUpAmount ? this.scrollUpAmount = 0 : this.scrollUpAmount = this.defaultScrollAmount;
  }

  private showNext(event) {
    this.firstRow += this.scrollDownAmount;
    this.stopRow += this.scrollDownAmount;
    this.checkScrollDownAmount();
  }

  private checkScrollDownAmount() {
    console.log(this.firstRow);
    console.log(this.stopRow);
    const rowsRemaining = this.rows.length - this.stopRow;
    rowsRemaining <= this.scrollDownAmount ? this.scrollDownAmount = rowsRemaining : this.scrollDownAmount = this.defaultScrollAmount;
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
