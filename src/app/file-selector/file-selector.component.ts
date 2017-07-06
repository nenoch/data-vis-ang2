import { Component, OnInit } from '@angular/core';
import { FileSelectorService } from './file-selector.service'

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent implements OnInit {

  files: any = [];

  filesChosen: Boolean = false;

  showFileSelector: Boolean;

  constructor(private fileSelectorService: FileSelectorService) { }


  ngOnInit() {
    this.setFileSelectorStatus();
  }

  onChange(event) {
    this.files = event.srcElement.files;
    this.files.length === 0 ? this.filesChosen = false : this.filesChosen = true;
  }

  hideHandler(event) {
    this.fileSelectorService.toggleShowFileSelector();
    this.setFileSelectorStatus();
  }

  setFileSelectorStatus() {
    this.showFileSelector = this.fileSelectorService.showFileSelector;
  }

}
