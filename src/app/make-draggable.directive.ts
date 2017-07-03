import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appMakeDraggable]'
})

export class MakeDraggableDirective {

  constructor() {}

  @HostListener('dragstart', ['$event']) public dragstartHandler(event) {
    event.dataTransfer.setData('text', event.target.id);
  }

}
