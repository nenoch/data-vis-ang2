import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UploadService } from './upload.service';
import { ErrorHandlerService } from '../error-handler/error-handler.service';
import { ConverterService } from './converter.service';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent implements OnInit {

  public showFileSelector = true;
  public filesChosen = false;

  private files: any = [];

  @Output() showState: EventEmitter<boolean> = new EventEmitter();
  @Output() loadingState: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private uploadService: UploadService,
    private errorService: ErrorHandlerService,
    private converterService: ConverterService
  ) { };

  ngOnInit() {
  }

  private onSubmit(form: NgForm) {
    if (!this.filesChosen) {
      this.errorService.handleError({title: 'Upload Failed', content: 'Please select SQL files to convert'});
      return;
    }
    this.loadingState.emit(true);
    this.uploadService.postFiles(this.files).subscribe(data => {
      if (data.message === 'Success') {
        this.resetForm(form);
        this.fileConvertion();
      }
    },
      err => {
        this.loadingState.emit(false);
        this.errorService.handleError({title: 'Upload Failed', content: err.statusText});
      })
  }

  private onChange(event) {
    this.files = event.target.files || [];
    this.files.length === 0 ? this.filesChosen = false : this.filesChosen = true;
  }

  private fileConvertion() {
    this.converterService.convertFiles().subscribe(
      data => {
      this.loadingState.emit(false);
      this.hideHandler();
    },
      err => {
        this.loadingState.emit(false);
        this.hideHandler();
        this.errorService.handleError({title: 'Convertion Failed', content: err.statusText});
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
    this.filesChosen = false;
    form.reset();
  }
}
