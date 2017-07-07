import { Component, OnInit } from '@angular/core';
import { Error } from '../error.model';
import { ErrorHandlerService } from '../error-handler.service';


@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.css']
})
export class ErrorModalComponent implements OnInit {
  private error: Error;
  private display = 'none';

  constructor(private errorService: ErrorHandlerService) { }

  ngOnInit() {
    this.errorService.errorEvent.subscribe((error) => {
    this.error = error;
    this.display = 'block';
    });
  }

  onHandled(){
    this.display= 'none';
  }

}
