import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent implements OnInit {
  files: any = [];

  constructor() { }

  ngOnInit() {
    this.files = [] // TODO REMOVE
  }

  onChange(event) {
    this.files = event.srcElement.files;
  }

}
