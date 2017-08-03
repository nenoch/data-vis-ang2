import { Component, OnInit, EventEmitter, Output, ElementRef, ViewChild } from '@angular/core';
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
  private toggleObject = { show: true, hide: false};
  private recentlyClicked = false;

  @Output() showState: EventEmitter<boolean> = new EventEmitter();
  @Output() loadingState: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('hideButton') hideButton: ElementRef;
  @ViewChild('fileInput') fileInput: ElementRef;

  constructor(
    private uploadService: UploadService,
    private errorService: ErrorHandlerService,
    private converterService: ConverterService,
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
      this.hideButton.nativeElement.click(); // Trigger fileselector collapse
      this.fileInput.nativeElement.value = ''; // Clear the input field text
    },
      err => {
        this.loadingState.emit(false);
        this.errorService.handleError({title: 'Convertion Failed', content: err.statusText});
      })
  }

  private hideHandler() {
    // Hacky way to stop a weird bug when double clicking toggle button, replace with ngx-bootstrap functions when transition is implemented
    if (this.recentlyClicked) { return; }
    this.recentlyClicked = true;
    setTimeout(() => this.recentlyClicked = false, 500);
    // --------------
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
