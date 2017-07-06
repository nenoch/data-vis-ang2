import { Component, OnInit } from '@angular/core';
import { FileSelectorService } from './file-selector/file-selector.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';
  public hideGraphCreator: Boolean = true;

  constructor(private fileSelectorService: FileSelectorService) { };

  ngOnInit() {
    // this.hideGraphCreator = this.fileSelectorService.showFileSelector;
  }

  private toggleGraphCreator(bool) {
    this.hideGraphCreator = !bool;
  }
}
