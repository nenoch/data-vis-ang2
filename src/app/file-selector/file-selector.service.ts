import { Injectable } from '@angular/core';

@Injectable()

export class FileSelectorService {

  public showFileSelector: Boolean = true;

  constructor() { }

  toggleShowFileSelector() {
    this.showFileSelector = !this.showFileSelector;
  }
}
