import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[makeDraggable]'
})

export class MakeDraggableDirective {

  constructor() {}

  @HostListener('dragstart', ['$event']) public dragstartHandler(event){
    console.log(event);
    event.dataTransfer.setData('text', event.target.id);
  }

}
