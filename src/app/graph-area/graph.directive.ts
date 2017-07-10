import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appGraph]'
})
export class GraphDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
