import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent implements OnInit {
  files: any = [];
  filesChosen: Boolean = false;

  constructor() { }

  ngOnInit() {
  }

  onChange(event) {
    this.files = event.srcElement.files;
    if (this.files.length === 0) {
      this.filesChosen = false;
    } else {
      this.filesChosen = true;
    }
  }

}
