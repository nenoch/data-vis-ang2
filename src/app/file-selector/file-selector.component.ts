import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UploadService } from '../upload.service';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent implements OnInit {

  public showFileSelector: Boolean = true;
  public filesChosen: Boolean = false;

  private files: any = [];

  @Output() showState: EventEmitter<Boolean> = new EventEmitter();

  constructor(private uploadService: UploadService) { };

  ngOnInit() {
  }

  private onSubmit(form: NgForm) {
    console.dir(this.files);
    this.uploadService.postFiles(this.files).subscribe(data => {
      console.log(data); // TODO figure out proper frontend response
    })
    // this.hideHandler();
  }

  private onChange(event) {
    console.log(event);
    this.files = event.target.files || [];
    this.files.length === 0 ? this.filesChosen = false : this.filesChosen = true;
  }

  private hideHandler() {
    this.showState.emit(this.showFileSelector);
    this.toggleShowFileSelector();
  }

  private toggleShowFileSelector() {
    this.showFileSelector = !this.showFileSelector;
  }
}
