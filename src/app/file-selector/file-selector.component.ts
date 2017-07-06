import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FileSelectorService } from './file-selector.service'

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent implements OnInit {

  public showFileSelector: Boolean;
  public filesChosen: Boolean = false;

  private files: any = [];

  @Output() showState: EventEmitter<Boolean> = new EventEmitter();

  constructor(private fileSelectorService: FileSelectorService) { };

  ngOnInit() {
    this.setFileSelectorStatus();
  }

  private onChange(event) {
    this.files = event.srcElement.files;
    this.files.length === 0 ? this.filesChosen = false : this.filesChosen = true;
  }

  private hideHandler(event) {
    this.showState.emit(this.showFileSelector);
    this.fileSelectorService.toggleShowFileSelector();
    this.setFileSelectorStatus();
  }

  private setFileSelectorStatus() {
    this.showFileSelector = this.fileSelectorService.showFileSelector;
  }

}
