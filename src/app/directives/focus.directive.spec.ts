import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';


import { Component, EventEmitter} from '@angular/core';
import { FocusDirective } from './focus.directive';

@Component({
  template: `
  <button type="submit" (click)='onSubmit()' value="Submit">Submit</button>
  <button type="button" [focus]="focusTrigger">`
})
class TestComponent {
  public focusTrigger = new EventEmitter<boolean>();

  onSubmit(){
    this.focusTrigger.emit(true);
  }
}

xdescribe('FocusDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let submitEl;
  let buttonEl: DebugElement;

  beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [TestComponent, FocusDirective]
      });

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    submitEl = fixture.nativeElement.querySelector('button[type="submit"]');      // to access DOM element

    // submitEl = fixture.debugElement.query(By.css('button[type="submit"]'));
    buttonEl = fixture.debugElement.query(By.css('button[type="button"]:focus'));
  });

  it('set the focus on button onSubmit()', () => {
    expect(buttonEl).toBeFalsy();
    submitEl.click();
    fixture.detectChanges();
    expect(buttonEl).toBeTruthy();
  });

});
