import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appMakeDroppable]'
})
export class MakeDroppableDirective {

  constructor() { }

  @HostListener('drop', ['$event']) public onDrop(event) {
    console.log(event);
    const data = event.dataTransfer.getData('text');
    event.preventDefault();
    event.target.value = data;
  }
}
