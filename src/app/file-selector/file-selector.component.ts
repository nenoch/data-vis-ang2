import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UploadService } from '../upload.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { ConverterService } from '../converter.service';

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

  constructor(private uploadService: UploadService, private errorService: ErrorHandlerService, private converterService: ConverterService) { };

  ngOnInit() {
  }

  private onSubmit(form: NgForm) {
    this.uploadService.postFiles(this.files).subscribe(data => {
      if (data.message === 'Success') {
        this.hideHandler();
        this.resetForm(form);
        this.fileConvertion();
      }
    },
      err => {
        console.log(err);
        this.errorService.handleError(err);
      })
  }

  private onChange(event) {
    this.files = event.target.files || [];
    this.files.length === 0 ? this.filesChosen = false : this.filesChosen = true;
  }

  private fileConvertion(){
    this.converterService.convertFiles().subscribe(
      data => {
      console.log(data.message);
    },
      err => {
        console.log(err);
        this.errorService.handleError(err);
      })

  }

  private hideHandler() {
    this.showState.emit(this.showFileSelector);
    this.toggleShowFileSelector();
  }

  private toggleShowFileSelector() {
    this.showFileSelector = !this.showFileSelector;
  }

  private resetForm(form: NgForm) {
    this.files = [];
    form.reset();
  }
}
