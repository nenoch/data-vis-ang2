import { Injectable, EventEmitter } from '@angular/core';
import { Error } from './error.model';

@Injectable()
export class ErrorHandlerService {

  public errorEvent = new EventEmitter();

  constructor() {}

  handleError(error){
    let errorObject = new Error(error.title, error.content);
    this.errorEvent.emit(errorObject);
  }

}
