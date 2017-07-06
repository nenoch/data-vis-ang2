import { Injectable } from '@angular/core';

@Injectable()

export class FileSelectorService {

  public showFileSelector: Boolean = true;

  constructor() { }

  public toggleShowFileSelector() {
    this.showFileSelector = !this.showFileSelector;
  }
}
