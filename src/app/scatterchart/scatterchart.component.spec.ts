import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScatterchartComponent } from './scatterchart.component';

xdescribe('ScatterchartComponent', () => {
  let component: ScatterchartComponent;
  let fixture: ComponentFixture<ScatterchartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScatterchartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScatterchartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
